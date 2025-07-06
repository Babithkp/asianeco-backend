import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { QuoteMailBody, sendQuoteMailToClient } from "./mails/quoteMail";

const prisma = new PrismaClient();

export const createQuote = async (req: Request, res: Response) => {
  const { date, dueDate, amount, Client, items, quoteId } = req.body;

  console.log(req.body);

  if (!date || !dueDate || !Client || !amount || !quoteId || !items) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    const existingQuote = await prisma.quote.findFirst({
      where: {
        quoteId,
      },
    });

    if (existingQuote) {
      res.status(203).json({
        message: "Quote already exists",
      });
      return;
    }

    // Get next quote sequence from Settings
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      res.status(400).json({
        message: "Settings not configured",
      });
      return;
    }

    await prisma.quote.create({
      data: {
        quoteId,
        date: new Date(date),
        dueDate: new Date(dueDate),
        amount: parseFloat(amount),
        clientId: Client.id,
        items: {
          connect:
            items?.map((item: any) => ({
              id: item.id,
            })) || [],
        },
      },
    });

    // Update quotation sequence in settings
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        quotationSequence: settings.quotationSequence + 1,
      },
    });

    res.status(200).json({
      message: "Quote created successfully",
    });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(400).json({
      message: "Failed to create quote",
    });
  }
};

export const updateQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, dueDate, amount, Client, items } = req.body;

  try {
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existingQuote) {
      res.status(203).json({
        message: "Quote doesn't exist",
      });
      return;
    }

    await prisma.quote.update({
      where: { id },
      data: {
        items: {
          set: [],
        },
      },
    });

    await prisma.quote.update({
      where: { id },
      data: {
        date: new Date(date),
        dueDate: new Date(dueDate),
        amount: parseFloat(amount),
        clientId: Client.id,
        items: {
          connect:
            items?.map((item: any) => ({
              id: item.id,
            })) || [],
        },
      },
    });

    res.status(200).json({
      message: "Quote updated successfully",
    });
  } catch (error) {
    console.error("Update quote error:", error);
    res.status(400).json({
      message: "Failed to update quote",
    });
  }
};

export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Quote ID is required",
    });
    return;
  }

  try {
    // Check if quote exists
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existingQuote) {
      res.status(203).json({
        message: "Quote doesn't exist",
      });
      return;
    }

    // Delete the quote
    await prisma.quote.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("Delete quote error:", error);
    res.status(400).json({
      message: "Failed to delete quote",
    });
  }
};

export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        items: true,
        Client: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      message: "Quotes retrieved successfully",
      data: quotes,
    });
  } catch (error) {
    console.error("Get quotes error:", error);
    res.status(400).json({
      message: "Failed to retrieve quotes",
    });
  }
};

export const sendQuoteMail = async (req: Request, res: Response) => {
  const { email } = req.params;

  const quotationData = JSON.parse(req.body.quotationData);

  if (!quotationData) {
    res.status(400).json({
      message: "Quotation data is required",
    });
    return;
  }

  const subject = "Quote details for - " + quotationData.quoteId;

  try {
    let attachments: any;
    if (req.file) {
      attachments = {
        filename: "quotation.pdf",
        content: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await sendQuoteMailToClient(
      email,
      subject,
      QuoteMailBody(quotationData),
      attachments
    );
    res.status(200).json({
      message: "LR Email Sent",
    });
  } catch (error) {
    console.error("Send quote mail error:", error);
    res.status(400).json({
      message: "Failed to send quote mail",
    });
  }
};
