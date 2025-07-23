import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createItem = async (req: Request, res: Response) => {
  const {
    itemName,
    category,
    supplerName,
    sellingPrice,
    measurement,
    tax,
    description,
  } = req.body;
  if (
    !itemName ||
    !category ||
    !supplerName ||
    !sellingPrice ||
    !measurement ||
    !tax
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    const isItemExists = await prisma.item.findFirst({
      where: { itemName },
    });

    if (isItemExists) {
      res.status(202).json({
        message: "Item already exists",
      });
      return;
    }

    // Create item record
    await prisma.item.create({
      data: {
        itemName,
        category,
        supplerName,
        sellingPrice: parseFloat(sellingPrice),
        measurement: measurement,
        tax,
        description: description || "",
      },
    });

    res.status(200).json({
      message: "Item created successfully",
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    itemName,
    category,
    supplerName,
    sellingPrice,
    measurement,
    tax,
    description,
  } = req.body;

  if (
    !itemName ||
    !category ||
    !supplerName ||
    !sellingPrice ||
    !measurement ||
    !tax
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  if (!id) {
    res.status(400).json({
      message: "Item ID is required",
    });
    return;
  }

  try {
    await prisma.item.update({
      where: { id },
      data: {
        itemName,
        category: category,
        supplerName,
        sellingPrice: parseFloat(sellingPrice),
        measurement: measurement,
        tax,
        description: description || "",
      },
    });

    res.status(200).json({
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({
      message: "Failed to update item",
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Item ID is required",
    });
    return;
  }

  try {
    // Check if item exists
    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      res.status(404).json({
        message: "Item not found",
      });
      return;
    }

    // Delete the item
    await prisma.item.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      message: "Failed to delete item",
    });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      include: {},
      orderBy: {
        itemName: "asc",
      },
    });

    res.status(200).json({
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      message: "Failed to retrieve items",
    });
  }
};

export const createPurchase = async (req: Request, res: Response) => {
  const {
    itemName,
    date,
    purchasePrice,
    quantity,
    amount,
    paymentType,
    transactionId,
  } = req.body;


  if (
    !itemName ||
    !date ||
    !purchasePrice ||
    !quantity ||
    !amount ||
    !paymentType ||
    !transactionId
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    await prisma.purchase.create({
      data: {
        itemId: itemName,
        date: new Date(date),
        purchasePrice: parseFloat(purchasePrice),
        quantity: parseFloat(quantity),
        amount: parseFloat(amount),
        paymentType: paymentType,
        transactionId: transactionId,
      },
    });

    await prisma.item.update({
      where: { id: itemName },
      data: {
        quantity: {
          increment: parseFloat(quantity),
        },
      },
    });

    res.status(200).json({
      message: "Purchase created successfully",
    });
  } catch (error) {
    console.error("Create purchase error:", error);
    res.status(500).json({
      message: "Failed to create purchase",
    });
    return;
  }
};

export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        item: {
          select: {
            id: true,
            itemName: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Purchases retrieved successfully",
      data: purchases,
    });
  } catch (error) {
    console.error("Get purchases error:", error);
    res.status(500).json({
      message: "Failed to retrieve purchases",
    });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    itemName,
    date,
    purchasePrice,
    quantity,
    amount,
    paymentType,
    transactionId,
  } = req.body;

  if (
    !itemName ||
    !date ||
    !purchasePrice ||
    !quantity ||
    !amount ||
    !paymentType ||
    !transactionId
  ) {
    res.status(400).json({
      message: "All required fields must be provided",
    });
    return;
  }

  if (!id) {
    res.status(400).json({
      message: "Item ID is required",
    });
    return;
  }

  try {
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!existingPurchase) {
      res.status(404).json({
        message: "Purchase not found",
      });
      return;
    }
    if (existingPurchase.quantity !== parseFloat(quantity)) {
      await prisma.$transaction(async (tx) => {
        await tx.item.update({
          where: { id: itemName },
          data: {
            quantity: {
              decrement: existingPurchase.quantity,
            },
          },
        });

        await tx.purchase.update({
          where: { id },
          data: {
            itemId: itemName,
            date: new Date(date),
            purchasePrice: parseFloat(purchasePrice),
            quantity: parseFloat(quantity),
            amount: parseFloat(amount),
            paymentType: paymentType,
            transactionId: transactionId,
          },
        });

        await tx.item.update({
          where: { id: itemName },
          data: {
            quantity: {
              increment: parseFloat(quantity),
            },
          },
        });
      });
    } else {
      await prisma.purchase.update({
        where: { id },
        data: {
          itemId: itemName,
          date: new Date(date),
          purchasePrice: parseFloat(purchasePrice),
          quantity: parseFloat(quantity),
          amount: parseFloat(amount),
          paymentType: paymentType,
          transactionId: transactionId,
        },
      });
    }

    res.status(200).json({
      message: "Purchase updated successfully",
    });
  } catch (error) {
    console.error("Create purchase error:", error);
    res.status(500).json({
      message: "Failed to update purchase",
    });
    return;
  }
};

export const deletePurchaseApi = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Purchase ID is required",
    });
    return;
  }
  try {
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!existingPurchase) {
      res.status(404).json({
        message: "Purchase not found",
      });
      return;
    }

    await prisma.item.update({
      where: { id: existingPurchase.itemId },
      data: {
        quantity: {
          decrement: existingPurchase.quantity,
        },
      },
    });

    await prisma.purchase.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    console.error("Delete purchase error:", error);
    res.status(500).json({
      message: "Failed to delete purchase",
    });
  }
};
