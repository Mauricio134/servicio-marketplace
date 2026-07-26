import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  AuthRequest,
} from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const {
        title,
        description,
        type,
        minBudget,
        maxBudget,
        price,
        estimatedTime,
        location,
      } = req.body;

      if (!title || !description || !type) {
        return res.status(400).json({
          message: "Empty mandatory fields",
        });
      }

      if (
        type !== "REQUEST" &&
        type !== "OFFER"
      ) {
        return res.status(400).json({
          message:
            "Type must be REQUEST or OFFER",
        });
      }

      if (type === "REQUEST") {
        if (
          minBudget === undefined ||
          maxBudget === undefined
        ) {
          return res.status(400).json({
            message:
              "Budget range is required for a request",
          });
        }

        if (
          Number(minBudget) < 0 ||
          Number(maxBudget) < 0
        ) {
          return res.status(400).json({
            message:
              "Budget cannot be negative",
          });
        }

        if (
          Number(minBudget) >
          Number(maxBudget)
        ) {
          return res.status(400).json({
            message:
              "Minimum budget cannot be greater than maximum budget",
          });
        }
      }

      if (type === "OFFER") {
        if (
          price === undefined ||
          estimatedTime === undefined
        ) {
          return res.status(400).json({
            message:
              "Price and estimated time are required for an offer",
          });
        }

        if (
          Number(price) < 0 ||
          Number(estimatedTime) <= 0
        ) {
          return res.status(400).json({
            message:
              "Price and estimated time must be valid",
          });
        }
      }

      const post =
        await prisma.post.create({
          data: {
            title,
            description,
            type,

            minBudget:
              type === "REQUEST"
                ? Number(minBudget)
                : null,

            maxBudget:
              type === "REQUEST"
                ? Number(maxBudget)
                : null,

            price:
              type === "OFFER"
                ? Number(price)
                : null,

            estimatedTime:
              estimatedTime !== undefined
                ? Number(estimatedTime)
                : null,

            location,

            userId: req.userId!,
          },
        });

      res.status(201).json(post);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error: Post not created",
      });
    }
  },
);

router.get("/", async (_req, res) => {
  try {
    const posts =
      await prisma.post.findMany({
        where: {
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Error: Not possible to get posts",
    });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: req.userId,
        type: "REQUEST",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error: Not possible to get my posts",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post =
      await prisma.post.findUnique({
        where: {
          id: String(req.params.id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Error: Not possible to get the specific post",
    });
  }
});

/* =========================
   DELETE POST
========================= */

router.delete(
  "/:id",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: String(req.params.id),
        },
      });

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      if (post.userId !== req.userId) {
        return res.status(403).json({
          message: "You can only delete your own post",
        });
      }

      await prisma.post.delete({
        where: {
          id: String(req.params.id),
        },
      });

      res.status(204).send();
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error: Post not deleted",
      });
    }
  },
);

export default router;
