import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (req: Request, res: Response) => {
  const {
    name,
    GSTIN,
    contactPerson,
    email,
    contactNumber,
    address,
    city,
    state,
    pincode,
    creditLimit,
  } = req.body;

  if (
    !name ||
    !contactPerson ||
    !email ||
    !contactNumber ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    res.status(401).json({
      message: "All required fields must be provided",
    });
    return;
  }

  try {
    // Check if client with same name already exists
    const existingClient = await prisma.client.findFirst({
      where: {
        name: name,
      },
    });

    if (existingClient) {
      res.status(202).json({
        message: "Client name already exists",
      });
      return;
    }

    await prisma.client.create({
      data: {
        name,
        GSTIN,
        contactPerson,
        email,
        contactNumber: BigInt(contactNumber),
        address,
        city,
        state,
        pincode: parseInt(pincode),
        creditLimit: parseFloat(creditLimit || "0"),
      },
    });

    res.status(200).json({
      message: "Client created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create client",
    });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    GSTIN,
    contactPerson,
    email,
    contactNumber,
    address,
    city,
    state,
    pincode,
    creditLimit,
  } = req.body;

  if (!id) {
    res.status(401).json({
      message: "Client ID is required",
    });
    return;
  }

  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!existingClient) {
      res.status(203).json({
        message: "Client doesn't exist",
      });
      return;
    }

    await prisma.client.update({
      where: {
        id: id,
      },
      data: {
        name,
        GSTIN,
        contactPerson,
        email,
        contactNumber: BigInt(contactNumber),
        address,
        city,
        state,
        pincode: parseInt(pincode),
        creditLimit: parseFloat(creditLimit || "0"),
      },
    });

    res.status(200).json({
      message: "Client updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update client",
    });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Client ID is required",
    });
    return;
  }

  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingClient) {
      res.status(203).json({
        message: "Client doesn't exist",
      });
      return;
    }

    await prisma.client.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete client",
    });
  }
};

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      message: "Clients retrieved successfully",
      clients: clients ?? [],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve clients",
    });
  }
};
