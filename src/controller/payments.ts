import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
  const {
    date,
    amount,
    amountInWords,
    pendingAmount,
    transactionId,
    paymentMode,
    remarks,
    invoiceNumber,
    clientName,
    invoiceId,
  } = req.body;

  if (
    !date ||
    !amount ||
    !amountInWords ||
    !transactionId ||
    !paymentMode ||
    !remarks ||
    !invoiceNumber ||
    !clientName ||
    !invoiceId
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    const payment = await prisma.payments.create({
      data: {
        date: new Date(date),
        amount: parseFloat(amount),
        amountInWords: amountInWords,
        pendingAmount: parseFloat(pendingAmount),
        transactionId,
        paymentMode,
        remarks,
        invoiceNumber,
        clientName,
        invoiceId,
      },
    });
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        pendingAmount: {
          decrement: payment.amount,
        },
        status: parseFloat(pendingAmount) === 0 ? "Paid" : "Pending",
      },
    });
    const client = await prisma.client.findUnique({
      where: { name: payment.clientName },
    });
    if (!client) {
      res.status(400).json({
        message: "Client not found",
      });
      return;
    }
    await prisma.client.update({
      where: { id: client.id },
      data: {
        outstanding: {
          decrement: payment.amount,
        },
      },
    });
    res.status(200).json({
      message: "Payment created successfully",
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(400).json({
      message: "Failed to create payment",
    });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    date,
    amount,
    amountInWords,
    pendingAmount,
    transactionId,
    paymentMode,
    remarks,
    invoiceNumber,
    clientName,
    invoiceId,
  } = req.body;

  if (
    !id ||
    !date ||
    !amount ||
    !amountInWords ||
    !pendingAmount ||
    !transactionId ||
    !paymentMode ||
    !remarks ||
    !invoiceNumber ||
    !clientName ||
    !invoiceId
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    const existingPayment = await prisma.payments.findUnique({
      where: { id },
    });
    if (!existingPayment) {
      res.status(203).json({
        message: "Payment doesn't exist",
      });
      return;
    }
    const payment = await prisma.payments.update({
      where: { id },
      data: {
        date: new Date(date),
        amount: parseFloat(amount),
        amountInWords,
        pendingAmount: parseFloat(pendingAmount),
        transactionId,
        paymentMode,
        remarks,
        invoiceNumber,
        clientName,
        invoiceId,
      },
    });
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        pendingAmount: parseFloat(pendingAmount),
        status: pendingAmount === 0 ? "Paid" : "Pending",
      },
    });

    const client = await prisma.client.findUnique({
      where: { name: payment.clientName },
    });
    if (!client) {
      res.status(400).json({
        message: "Client not found",
      });
      return;
    }
    const oldOutstanding = client.outstanding - existingPayment?.pendingAmount;

    await prisma.client.update({
      where: { id: client.id },
      data: {
        outstanding: oldOutstanding + parseFloat(pendingAmount),
      },
    });
    res.status(200).json({
      message: "Payment updated successfully",
    });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(400).json({
      message: "Failed to update payment",
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Payment ID is required",
    });
    return;
  }

  try {
    // Check if payment exists
    const existingPayment = await prisma.payments.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      res.status(203).json({
        message: "Payment doesn't exist",
      });
      return;
    }

    const invoice = await prisma.invoice.update({
      where: { id: existingPayment.invoiceId! },
      data: {
        pendingAmount: {
          increment: existingPayment.amount,
        },
      },
    });

    await prisma.client.update({
      where: { id: invoice.clientId! },
      data: {
        outstanding: {
          increment: existingPayment.amount,
        },
      },
    });

    await prisma.payments.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(400).json({
      message: "Failed to delete payment",
    });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payments.findMany({
      take: 10,
      include: {
        Invoice: {
          select: {
            invoiceId: true,
            Client: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(400).json({
      message: "Failed to retrieve payments",
    });
  }
};
