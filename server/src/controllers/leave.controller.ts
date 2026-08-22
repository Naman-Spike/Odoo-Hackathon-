import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const createLeave = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { leaveType, startDate, endDate, reason } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    const currentYear = new Date().getFullYear();
    
    if (leaveType === 'PAID' || leaveType === 'SICK') {
      const leavesThisYear = await prisma.leave.findMany({
        where: {
          userId,
          leaveType,
          status: { in: ['APPROVED', 'PENDING'] },
          startDate: {
            gte: new Date(currentYear, 0, 1),
            lt: new Date(currentYear + 1, 0, 1),
          }
        }
      });
      
      let usedDays = 0;
      for (const leave of leavesThisYear) {
        const diffTime = Math.abs(new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        usedDays += diffDays;
      }
      
      const newDiffTime = Math.abs(end.getTime() - start.getTime());
      const newDiffDays = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const maxAllowed = leaveType === 'PAID' ? 12 : 6;
      if (usedDays + newDiffDays > maxAllowed) {
        const remaining = Math.max(0, maxAllowed - usedDays);
        return res.status(400).json({ 
          error: `Insufficient ${leaveType} leave balance. Requested ${newDiffDays} days but only ${remaining} days available.` 
        });
      }
    }

    const leave = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        status: 'PENDING',
      }
    });

    return res.status(201).json(leave);
  } catch (error) {
    console.error('Create leave error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyLeaves = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const leaves = await prisma.leave.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: {
        reviewer: {
          select: {
            profile: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    });
    return res.json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeaveBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const currentYear = new Date().getFullYear();
    
    const leavesThisYear = await prisma.leave.findMany({
      where: {
        userId,
        status: 'APPROVED',
        startDate: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        }
      }
    });
    
    let paidUsed = 0;
    let sickUsed = 0;
    let unpaidUsed = 0;
    
    for (const leave of leavesThisYear) {
      const diffTime = Math.abs(new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (leave.leaveType === 'PAID') paidUsed += diffDays;
      else if (leave.leaveType === 'SICK') sickUsed += diffDays;
      else if (leave.leaveType === 'UNPAID') unpaidUsed += diffDays;
    }
    
    return res.json({
      paid: { used: paidUsed, total: 12, remaining: Math.max(0, 12 - paidUsed), balance: Math.max(0, 12 - paidUsed) },
      sick: { used: sickUsed, total: 6, remaining: Math.max(0, 6 - sickUsed), balance: Math.max(0, 6 - sickUsed) },
      unpaid: { used: unpaidUsed, total: 'Unlimited', remaining: 'Unlimited', balance: null }
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPendingLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            employeeId: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, department: true } }
          }
        }
      },
      orderBy: { startDate: 'desc' },
    });
    return res.json(leaves);
  } catch (error) {
    console.error('Get pending leaves error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        user: {
          select: {
            employeeId: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, department: true } }
          }
        },
        reviewer: {
          select: {
            profile: { select: { firstName: true, lastName: true } }
          }
        }
      },
      orderBy: { startDate: 'desc' },
    });
    return res.json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const reviewLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const reviewerId = req.user!.userId;

    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status,
        adminRemarks,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      }
    });

    if (status === 'APPROVED') {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const currentDate = new Date(start);
      
      while (currentDate <= end) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          const workDate = new Date(currentDate);
          workDate.setHours(0, 0, 0, 0);
          
          await prisma.attendance.upsert({
            where: {
              userId_workDate: { userId: leave.userId, workDate },
            },
            update: {
              status: 'LEAVE',
            },
            create: {
              userId: leave.userId,
              workDate,
              status: 'LEAVE',
            }
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return res.json(leave);
  } catch (error) {
    console.error('Review leave error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
