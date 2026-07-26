import { Router } from "express";
import {
  authenticate,
  AuthRequest,
} from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get(
  "/",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      await prisma.notification.deleteMany({
        where: {
          userId: req.userId!,
          createdAt: {
            lt: new Date(
              Date.now() -
                30 *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
        },
      });

      const notifications =
        await prisma.notification.findMany({
          where: {
            userId: req.userId!,
          },
          include: {
            offer: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    whatsapp: true,
                  },
                },
                post: {
                  select: {
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(notifications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error loading notifications",
      });
    }
  },
);

router.patch(
  "/:id/read",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const notification =
        await prisma.notification.findFirst({
          where: {
            id: String(req.params.id),
            userId: req.userId!,
          },
        });

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      const updated =
        await prisma.notification.update({
          where: {
            id: notification.id,
          },
          data: {
            read: true,
          },
        });

      res.json(updated);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error marking notification as read",
      });
    }
  },
);

router.patch(
  "/read-all",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      await prisma.notification.updateMany({
        where: {
          userId: req.userId!,
          read: false,
        },
        data: {
          read: true,
        },
      });

      res.json({
        message:
          "Notifications marked as read",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error marking notifications as read",
      });
    }
  },
);

export default router;
