// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { UserRole } from "@prisma/client"; // Add this

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as {
    email: string;
    password: string;
    name?: string;
  };

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: UserRole.CREATOR, // Default to creator
    },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.json({ 
    id: user.id, 
    email: user.email, 
    name: user.name,
    role: user.role,
    token 
  });
}
