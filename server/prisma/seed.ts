import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const employeePassword = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      email: 'admin@dayflow.com',
      passwordHash: adminPassword,
      employeeId: 'EMP-001',
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          department: 'Human Resources',
          designation: 'HR Manager',
          joiningDate: new Date('2024-01-15T00:00:00Z'),
        },
      },
      payroll: {
        create: {
          basicSalary: 75000,
          allowances: 15000,
          deductions: 8000,
          netSalary: 82000,
        },
      },
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      email: 'employee@dayflow.com',
      passwordHash: employeePassword,
      employeeId: 'EMP-002',
      role: 'EMPLOYEE',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
          designation: 'Software Developer',
          phone: '+1-555-0102',
          joiningDate: new Date('2024-03-01T00:00:00Z'),
        },
      },
      payroll: {
        create: {
          basicSalary: 55000,
          allowances: 10000,
          deductions: 6000,
          netSalary: 59000,
        },
      },
    },
  });

  // Create attendance for last 7 days
  for (let i = 1; i <= 7; i++) {
    const workDate = new Date();
    workDate.setDate(workDate.getDate() - i);
    workDate.setHours(0, 0, 0, 0);
    
    // Skip weekends
    if (workDate.getDay() === 0 || workDate.getDay() === 6) continue;

    const checkIn = new Date(workDate);
    checkIn.setHours(9, 0, 0, 0);

    const checkOut = new Date(workDate);
    checkOut.setHours(17, 30, 0, 0);

    for (const userId of [admin.id, employee.id]) {
      await prisma.attendance.upsert({
        where: {
          userId_workDate: {
            userId,
            workDate,
          },
        },
        update: {},
        create: {
          userId,
          workDate,
          checkIn,
          checkOut,
          status: 'PRESENT',
          totalHours: 8.5,
        },
      });
    }
  }

  // Create leaves
  const pastStartDate = new Date();
  pastStartDate.setDate(pastStartDate.getDate() - 10);
  const pastEndDate = new Date(pastStartDate);
  pastEndDate.setDate(pastEndDate.getDate() + 1);

  await prisma.leave.create({
    data: {
      userId: employee.id,
      leaveType: 'PAID',
      startDate: pastStartDate,
      endDate: pastEndDate,
      reason: 'Family event',
      status: 'APPROVED',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    },
  });

  const futureStartDate = new Date();
  futureStartDate.setDate(futureStartDate.getDate() + 5);
  const futureEndDate = new Date(futureStartDate);

  await prisma.leave.create({
    data: {
      userId: employee.id,
      leaveType: 'SICK',
      startDate: futureStartDate,
      endDate: futureEndDate,
      reason: 'Doctor appointment',
      status: 'PENDING',
    },
  });

  console.log({ admin, employee });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
