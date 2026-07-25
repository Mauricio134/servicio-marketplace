import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: {id: true, name: true, email: true, createdAt: true, updatedAt: true} });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error: Users not found",
    });
  }
});

router.post("/", async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.user.create({ data : { name, email, password: hashedPassword } });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : "Error: User not created" });
    }
});

export default router;
