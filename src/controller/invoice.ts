import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { InvoiceMailBody, sendInvoiceMailToClient } from "./mails/invoiceMail";

const prisma = new PrismaClient();

export const createInvoice = async (req: Request, res: Response) => {
  const { date, dueDate, discount, status, total, items, Client, invoiceId } =
    req.body;

  if (!date || !dueDate || !total || !invoiceId || !items || !Client) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    // Get next invoice sequence from Settings
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      res.status(400).json({
        message: "Settings not configured",
      });
      return;
    }

    await prisma.invoice.create({
      data: {
        invoiceId,
        date: new Date(date),
        dueDate: new Date(dueDate),
        discount: discount || 0,
        status: status || "pending",
        total: parseFloat(total),
        clientId: Client.id,
        pendingAmount: parseFloat(total),
        items: {
          connect:
            items?.map((item: any) => ({
              id: item.id,
            })) || [],
        },
      },
    });

    // Update invoice sequence in settings
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        invoiceSequence: settings.invoiceSequence + 1,
      },
    });

    let updatedClient = null;
    if (Client) {
      updatedClient = await prisma.client.update({
        where: { id: Client.id },
        data: {
          outstanding: {
            increment: parseFloat(total),
          },
        },
      });

      // Check if outstanding exceeds creditLimit and create notification
      if (updatedClient.outstanding > updatedClient.creditLimit) {
        await prisma.notification.create({
          data: {
            title: "Credit Limit Exceeded",
            description: "",
            message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`,
          },
        });
      }
    }

    res.status(200).json({
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(400).json({
      message: "Failed to create invoice",
    });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  const { id, date, dueDate, discount, status, total, Client, items } =
    req.body;

  if (!id || !date || !dueDate || !total || !Client) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      res.status(203).json({
        message: "Invoice doesn't exist",
      });
      return;
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        items: {
          set: [],
        },
      },
    });

    let oldPayments = 0;

    const payment = await prisma.payments.findMany({
      where: { invoiceId: id },
    });
    if (payment) {
      oldPayments = payment.reduce((acc, curr) => acc + curr.amount, 0);
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        date: new Date(date),
        dueDate: new Date(dueDate),
        discount: discount || 0,
        status: status || "pending",
        total: parseFloat(total),
        clientId: Client.id,
        pendingAmount: parseFloat(total) - oldPayments,
        items: {
          connect:
            items?.map((item: any) => ({
              id: item.id,
            })) || [],
        },
      },
    });

    // Subtract the old invoice total from client's outstanding and update
    if (existingInvoice.clientId && existingInvoice.clientId !== Client.id) {
      let existingTotal = existingInvoice.pendingAmount;
      const client = await prisma.client.findUnique({
        where: { id: existingInvoice.clientId },
      });
      if (!client) {
        res.status(400).json({
          message: "Client not found",
        });
        return;
      }

      const outstanding = client.outstanding - existingTotal;

      const updatedClient = await prisma.client.update({
        where: { id: existingInvoice.clientId },
        data: {
          outstanding: outstanding,
        },
      });

      const newClient = await prisma.client.findUnique({
        where: { id: Client.id },
      });
      if (!newClient) {
        res.status(400).json({
          message: "Client not found",
        });
        return;
      }
      const newoutstanding =
        newClient.outstanding + parseFloat(existingTotal.toString());
      await prisma.client.update({
        where: { id: newClient.id },
        data: {
          outstanding: newoutstanding,
        },
      });

      // Check if outstanding exceeds creditLimit and create notification
      if (updatedClient.outstanding > updatedClient.creditLimit) {
        await prisma.notification.create({
          data: {
            title: "Credit Limit Exceeded",
            description: "",
            message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`,
          },
        });
      }
    } else {
      const client = await prisma.client.findUnique({
        where: { id: Client.id },
      });
      if (!client) {
        res.status(400).json({
          message: "Client not found",
        });
        return;
      }

      if (client.outstanding < parseFloat(total)) {
        await prisma.notification.create({
          data: {
            title: "Credit Limit Exceeded",
            description: "",
            message: `Outstanding (${client.outstanding}) has exceeded credit limit of (${client.creditLimit}) for client ${client.name}`,
          },
        });
      }
    }

    res.status(200).json({
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(400).json({
      message: "Failed to update invoice",
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({
      message: "Invoice ID is required",
    });
    return;
  }

  try {
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      res.status(203).json({
        message: "Invoice doesn't exist",
      });
      return;
    }

    // Delete the invoice
    await prisma.invoice.delete({
      where: { id },
    });

    if (existingInvoice.clientId) {
      // Subtract the invoice total from client's outstanding
      await prisma.client.update({
        where: { id: existingInvoice.clientId },
        data: {
          outstanding: {
            decrement: existingInvoice.pendingAmount,
          },
        },
      });
    }

    res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(400).json({
      message: "Failed to delete invoice",
    });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true,
        Client: true,
        payments: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      message: "Invoices retrieved successfully",
      data: invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(400).json({
      message: "Failed to retrieve invoices",
    });
  }
};

export const sendInvoiceMail = async (req: Request, res: Response) => {
  const { email } = req.params;

  const invoiceData = JSON.parse(req.body.invoiceData);

  if (!invoiceData) {
    res.status(400).json({
      message: "Invoice data is required",
    });
    return;
  }

  const subject = "Invoice details for - " + invoiceData.invoiceId;

  try {
    let attachments: any;
    if (req.file) {
      attachments = {
        filename: "invoice.pdf",
        content: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await sendInvoiceMailToClient(
      email,
      subject,
      InvoiceMailBody(invoiceData),
      attachments
    );
    res.status(200).json({
      message: "LR Email Sent",
    });
  } catch (error) {
    console.error("Send invoice mail error:", error);
    res.status(400).json({
      message: "Failed to send invoice mail",
    });
  }
};
