import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createExpense = async (req: Request, res: Response) => {
  const {
    expenseId,
    description,
    date,
    category,
    amount,
    amountInWords,
    paymentType,
    transactionId,
    title,
  } = req.body;

  if (
    !description ||
    !date ||
    !category ||
    !amount ||
    !paymentType ||
    !transactionId ||
    !title ||
    !expenseId
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {

    const existingExpense = await prisma.expenses.findUnique({
      where: { expenseId },
    });

    if (existingExpense) {
      res.status(203).json({
        message: "Expense ID already exists",
      });
      return;
    }

    // Get next expense sequence from Settings
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      res.status(400).json({
        message: "Settings not configured",
      });
      return;
    }

    await prisma.expenses.create({
      data: {
        expenseId,
        description,
        date: new Date(date),
        category,
        amount: parseFloat(amount || "0"),
        amountInWords: amountInWords,
        paymentType,
        transactionId: transactionId,
        title,
      },
    });

    // Update expense sequence in settings
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        expenseSequence: settings.expenseSequence + 1,
      },
    });

    res.status(200).json({
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(400).json({
      message: "Failed to create expense",
    });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    expenseId,
    description,
    date,
    category,
    amount,
    amountInWords,
    paymentType,
    transactionId,
    title,
  } = req.body;

  if (
    !expenseId ||
    !description ||
    !date ||
    !category ||
    !amount ||
    !paymentType ||
    !transactionId ||
    !title
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  if (!id) {
    res.status(400).json({
      message: "Expense ID is required",
    });
    return;
  }

  try {
    // Check if expense exists
    const existingExpense = await prisma.expenses.findUnique({
      where: { id, expenseId },
    });

    if (!existingExpense) {
      res.status(203).json({
        message: "Expense doesn't exist",
      });
      return;
    }

    await prisma.expenses.update({
      where: { id },
      data: {
        description,
        date: new Date(date),
        category,
        amount: parseFloat(amount || "0"),
        amountInWords: amountInWords || "",
        paymentType,
        transactionId: transactionId,
        title,
      },
    });

    res.status(200).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(400).json({
      message: "Failed to update expense",
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Expense ID is required",
    });
    return;
  }

  try {
    // Check if expense exists
    const existingExpense = await prisma.expenses.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      res.status(203).json({
        message: "Expense doesn't exist",
      });
      return;
    }

    await prisma.expenses.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(400).json({
      message: "Failed to delete expense",
    });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(400).json({
      message: "Failed to retrieve expenses",
    });
  }
};
