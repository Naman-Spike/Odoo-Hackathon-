import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { config } from '../config.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { employeeId, email, password, role } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { employeeId }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or Employee ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          employeeId,
          email,
          passwordHash,
          role,
          profile: {
            create: {
              firstName: '',
              lastName: '',
            },
          },
          payroll: {
            create: {
              basicSalary: 0,
              allowances: 0,
              deductions: 0,
              netSalary: 0,
            },
          },
        },
      });
    });

    const { passwordHash: _, ...userData } = user;
    return res.status(201).json(userData);
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN as any }
    );

    const { passwordHash: _, ...userData } = user;
    return res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { passwordHash: _, ...userData } = user;
    return res.json(userData);
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
