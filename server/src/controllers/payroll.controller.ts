import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getMyPayroll = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const payroll = await prisma.payroll.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            employeeId: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, department: true, designation: true } }
          }
        }
      }
    });

    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });
    
    return res.json(payroll);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllPayroll = async (req: Request, res: Response) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        user: {
          select: {
            employeeId: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, department: true, designation: true } }
          }
        }
      }
    });
    
    return res.json(payrolls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePayroll = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { basicSalary, allowances, deductions } = req.body;
    
    const existing = await prisma.payroll.findUnique({ where: { userId } });
    if (!existing) return res.status(404).json({ error: 'Payroll not found' });

    const newBasic = basicSalary !== undefined ? basicSalary : existing.basicSalary;
    const newAllowances = allowances !== undefined ? allowances : existing.allowances;
    const newDeductions = deductions !== undefined ? deductions : existing.deductions;
    
    const netSalary = newBasic + newAllowances - newDeductions;

    const payroll = await prisma.payroll.update({
      where: { userId },
      data: {
        basicSalary: newBasic,
        allowances: newAllowances,
        deductions: newDeductions,
        netSalary,
        effectiveDate: new Date(),
      }
    });

    return res.json(payroll);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
