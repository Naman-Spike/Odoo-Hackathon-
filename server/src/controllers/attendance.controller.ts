import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const checkIn = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const workDate = new Date(now);
    workDate.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_workDate: { userId, workDate },
      }
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({ error: 'Already checked in for today' });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_workDate: { userId, workDate },
      },
      update: {
        checkIn: now,
        status: 'PRESENT',
      },
      create: {
        userId,
        workDate,
        checkIn: now,
        status: 'PRESENT',
      }
    });

    return res.json(attendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const workDate = new Date(now);
    workDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_workDate: { userId, workDate },
      }
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ error: 'Must check in before checking out' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ error: 'Already checked out for today' });
    }

    const totalHours = (now.getTime() - attendance.checkIn.getTime()) / 3600000;
    const status = totalHours < 4 ? 'HALF_DAY' : 'PRESENT';

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: now,
        totalHours,
        status,
      }
    });

    return res.json(updatedAttendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getToday = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const workDate = new Date();
    workDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_workDate: { userId, workDate },
      }
    });

    return res.json(attendance || null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;
    
    const where: any = { userId };
    
    if (startDate || endDate) {
      where.workDate = {};
      if (startDate) where.workDate.gte = new Date(startDate as string);
      if (endDate) where.workDate.lte = new Date(endDate as string);
    }

    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { workDate: 'desc' },
    });

    return res.json(attendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {};
    if (startDate || endDate) {
      where.workDate = {};
      if (startDate) where.workDate.gte = new Date(startDate as string);
      if (endDate) where.workDate.lte = new Date(endDate as string);
    }

    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { workDate: 'desc' },
      include: {
        user: {
          select: {
            employeeId: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                department: true,
              }
            }
          }
        }
      }
    });

    return res.json(attendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
