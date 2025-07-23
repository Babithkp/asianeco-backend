import { Request, Response } from "express";import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAdmin = async () => {
  try {
    const isAdminExists = await prisma.admin.findFirst();
    if (!isAdminExists) {
      await prisma.admin.create({
        data: {
          userName: "admin",
          password: "admin@123",
          purchaseValue: 0,
        },
      });
    } else {
      console.log("Admin already exists");
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: "Username and password are required",
    });
    return;
  }
  try {
    const user = await prisma.admin.findUnique({
      where: {
        userName: username,
        password: password,
      },
    });
    if (user) {
      res.status(200).json({
        message: "Login Successful",
        user,
      });
    } else {
      res.status(203).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllNotification = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(400).json({
      message: "Failed to retrieve notifications",
    });
  }
};


export const updateNotificationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Notification ID is required",
    });
    return;
  }

  try {
    const existingNotification = await prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!existingNotification) {
      res.status(203).json({
        message: "Notification doesn't exist",
      });
      return;
    }

    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        status: "read",
      },
    });

    res.status(200).json({
      message: "Notification status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update notification status",
    });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Notification ID is required",
    });
    return;
  }

  try {
    const existingNotification = await prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!existingNotification) {
      res.status(203).json({
        message: "Notification doesn't exist",
      });
      return;
    }

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete notification",
    });
  }
};