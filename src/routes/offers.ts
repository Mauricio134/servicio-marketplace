import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  AuthRequest,
} from "../middleware/auth.js";

const router = Router();

/* =========================
   CREATE OFFER
========================= */

router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const {
        price,
        estimatedTime,
        message,
        postId,
      } = req.body;

      if (
        price === undefined ||
        estimatedTime === undefined ||
        !message ||
        !postId
      ) {
        return res.status(400).json({
          message: "Empty mandatory fields",
        });
      }

      const post =
        await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      if (post.status === "CLOSED") {
        return res.status(400).json({
          message:
            "This need is already closed",
        });
      }

      if (post.userId === req.userId) {
        return res.status(400).json({
          message:
            "You cannot make an offer on your own need",
        });
      }

      const offer =
        await prisma.offer.create({
          data: {
            price: Number(price),
            estimatedTime: Number(
              estimatedTime,
            ),
            message,
            postId,
            userId: req.userId!,
          },
        });

      const offerCount =
        await prisma.offer.count({
          where: {
            postId,
          },
        });

      const notification =
        await prisma.notification.create({
          data: {
            userId: post.userId,
            message:
              `Has recibido ${offerCount} ${
                offerCount === 1
                  ? "oferta"
                  : "ofertas"
              } para "${post.title}".`,
            type: "NEW_OFFER",
            offerId: offer.id,
          },
        });

      res.status(201).json(offer);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error in creating offer",
      });
    }
  },
);

/* =========================
   GET OFFERS FOR A POST
========================= */

router.get(
  "/post/:postId",
  authenticate,
  async (req, res) => {
    try {
      const offers =
        await prisma.offer.findMany({
          where: {
            postId: String(req.params.postId),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                whatsapp: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(offers);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error in finding offers",
      });
    }
  },
);

/* =========================
   UPDATE OFFER
========================= */

router.patch(
  "/:id",
  authenticate,
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const {
        price,
        estimatedTime,
        message,
      } = req.body;

      const offer =
        await prisma.offer.findUnique({
          where: {
            id: String(req.params.id),
          },
          include: {
            post: true,
          },
        });

      if (!offer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      if (offer.userId !== req.userId) {
        return res.status(403).json({
          message:
            "You can only edit your own offer",
        });
      }

      if (offer.status === "ACCEPTED") {
        return res.status(400).json({
          message:
            "An accepted offer cannot be edited",
        });
      }

      if (offer.post.status === "CLOSED") {
        return res.status(400).json({
          message:
            "Offers cannot be edited after the need is closed",
        });
      }

      if (
        price === undefined &&
        estimatedTime === undefined &&
        message === undefined
      ) {
        return res.status(400).json({
          message:
            "At least one field is required",
        });
      }

      const updatedOffer =
        await prisma.offer.update({
          where: {
            id: offer.id,
          },
          data: {
            ...(price !== undefined && {
              price: Number(price),
            }),

            ...(estimatedTime !== undefined && {
              estimatedTime: Number(estimatedTime),
            }),

            ...(message !== undefined && {
              message,
            }),
          },
        });

      res.json(updatedOffer);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating offer",
      });
    }
  },
);

/* =========================
   DELETE OFFER
========================= */

router.delete(
  "/:id",
  authenticate,
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const offer =
        await prisma.offer.findUnique({
          where: {
            id: String(req.params.id),
          },
        });

      if (!offer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      if (offer.userId !== req.userId) {
        return res.status(403).json({
          message:
            "You can only delete your own offer",
        });
      }

      if (offer.status === "ACCEPTED") {
        return res.status(400).json({
          message:
            "Accepted offers cannot be deleted",
        });
      }

      await prisma.offer.delete({
        where: {
          id: offer.id,
        },
      });

      res.status(204).send();
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting offer",
      });
    }
  },
);

/* =========================
   MARK OFFER AS INTERESTING
========================= */

router.patch(
  "/:id/interest",
  authenticate,
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const offer =
        await prisma.offer.findUnique({
          where: {
            id: String(req.params.id),
          },
          include: {
            post: true,
          },
        });

      if (!offer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      if (
        offer.post.userId !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the owner of the post can mark an offer as interesting",
        });
      }

      const updatedOffer =
        await prisma.offer.update({
          where: {
            id: offer.id,
          },
          data: {
            status: "INTERESTED",
          },
        });

      res.json(updatedOffer);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error marking offer as interesting",
      });
    }
  },
);

/* =========================
   CANCEL INTEREST
========================= */

router.patch(
  "/:id/cancel-interest",
  authenticate,
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const offer =
        await prisma.offer.findUnique({
          where: {
            id: String(req.params.id),
          },
          include: {
            post: true,
          },
        });

      if (!offer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      if (
        offer.post.userId !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the owner of the post can cancel interest",
        });
      }

      const updatedOffer =
        await prisma.offer.update({
          where: {
            id: offer.id,
          },
          data: {
            status: "PENDING",
          },
        });

      res.json(updatedOffer);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error cancelling interest",
      });
    }
  },
);

/* =========================
   ACCEPT OFFER
========================= */

router.patch(
  "/:id/accept",
  authenticate,
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const offer =
        await prisma.offer.findUnique({
          where: {
            id: String(req.params.id),
          },
          include: {
            post: true,
          },
        });

      if (!offer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      if (
        offer.post.userId !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the owner of the need can accept an offer",
        });
      }

      if (
        offer.post.status ===
        "CLOSED"
      ) {
        return res.status(400).json({
          message:
            "This need is already closed",
        });
      }

      const result =
        await prisma.$transaction(
          async (tx) => {
            const acceptedOffer =
              await tx.offer.update({
                where: {
                  id: offer.id,
                },
                data: {
                  status: "ACCEPTED",
                },
              });

            const rejectedOffers =
              await tx.offer.findMany({
                where: {
                  postId: offer.postId,
                  id: {
                    not: offer.id,
                  },
                },
              });

            await tx.offer.updateMany({
              where: {
                postId: offer.postId,
                id: {
                  not: offer.id,
                },
              },
              data: {
                status: "REJECTED",
              },
            });

            for (const rejectedOffer of rejectedOffers) {
              await tx.notification.create({
                data: {
                  userId: rejectedOffer.userId,
                  message:
                    `Tu oferta para "${offer.post.title}" ha sido rechazada.`,
                  type: "OFFER_REJECTED",
                  offerId: rejectedOffer.id,
                },
              });
            }

            await tx.post.update({
              where: {
                id: offer.postId,
              },
              data: {
                status: "CLOSED",
              },
            });

            await tx.notification.create({
              data: {
                userId: offer.userId,
                message:
                  `Tu oferta para "${offer.post.title}" ha sido aceptada.`,
                type: "OFFER_ACCEPTED",
                offerId: offer.id,
              },
            });

            return acceptedOffer;
          },
        );

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error accepting offer",
      });
    }
  },
);

export default router;
