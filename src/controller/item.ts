import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createItem = async (req: Request, res: Response) => {
  const {
    itemName,
    category,
    supplerName,
    purchasePrice,
    sellingPrice,
    measurement,
    purchaseQty,
    tax,
    description,
  } = req.body;
  if (
    !itemName ||
    !category ||
    !supplerName ||
    !purchasePrice ||
    !sellingPrice ||
    !measurement ||
    !purchaseQty ||
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
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        measurement: measurement,
        purchaseQty: parseFloat(purchaseQty || "0"),
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
    purchasePrice,
    sellingPrice,
    measurement,
    purchaseQty,
    tax,
    description,
  } = req.body;

  if (
    !itemName ||
    !category ||
    !supplerName ||
    !purchasePrice ||
    !sellingPrice ||
    !measurement ||
    !purchaseQty ||
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
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        measurement: measurement,
        purchaseQty: parseFloat(purchaseQty),
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
      include:{
        Quote: {
          select:{
            id:true
          }
        },
        Invoice: {
          select:{
            id:true
          }
        }
      },
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
