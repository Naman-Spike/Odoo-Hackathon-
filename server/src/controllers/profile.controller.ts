import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
            isVerified: true,
            createdAt: true,
          }
        }
      }
    });
    return res.json(profiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
          }
        }
      }
    });
    
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
          }
        }
      }
    });
    
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const updateData = { ...req.body };
    
    if (req.user!.role === 'EMPLOYEE') {
      const allowedFields = ['phone', 'address', 'avatarUrl'];
      Object.keys(updateData).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updateData[key];
        }
      });
    }

    if (updateData.joiningDate) {
      updateData.joiningDate = new Date(updateData.joiningDate);
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: updateData,
    });
    
    return res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData = { ...req.body };

    if (updateData.joiningDate) {
      updateData.joiningDate = new Date(updateData.joiningDate);
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: updateData,
    });
    
    return res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
