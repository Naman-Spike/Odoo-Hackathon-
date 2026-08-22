import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const q = query.toLowerCase();

    // === LEAVE BALANCE ===
    if (q.includes('leave') && (q.includes('balance') || q.includes('remaining') || q.includes('how many'))) {
      const currentYear = new Date().getFullYear();
      const leaves = await prisma.leave.findMany({
        where: {
          userId,
          status: 'APPROVED',
          startDate: { gte: new Date(currentYear, 0, 1), lt: new Date(currentYear + 1, 0, 1) }
        }
      });

      let paidUsed = 0, sickUsed = 0, unpaidUsed = 0;
      for (const l of leaves) {
        const days = Math.ceil(Math.abs(new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / 86400000) + 1;
        if (l.leaveType === 'PAID') paidUsed += days;
        else if (l.leaveType === 'SICK') sickUsed += days;
        else unpaidUsed += days;
      }

      return res.json({
        response: `📊 **Your Leave Balance Report (${currentYear})**\n\n• **Paid Leave**: ${12 - paidUsed} remaining out of 12 days (${paidUsed} used)\n• **Sick Leave**: ${6 - sickUsed} remaining out of 6 days (${sickUsed} used)\n• **Unpaid Leave**: ${unpaidUsed} days taken (no limit)\n\nYou can apply for leave from the Leave Tracker page.`
      });
    }

    // === DRAFT LEAVE REQUEST ===
    if (q.includes('draft') && q.includes('leave')) {
      const daysMatch = q.match(/(\d+)[- ]?day/);
      const days = daysMatch ? parseInt(daysMatch[1]) : 2;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const end = new Date(tomorrow);
      end.setDate(end.getDate() + days - 1);

      const profile = await prisma.profile.findUnique({ where: { userId } });
      const name = profile ? `${profile.firstName} ${profile.lastName}` : 'Employee';

      let leaveType = 'SICK';
      if (q.includes('paid') || q.includes('vacation') || q.includes('personal')) leaveType = 'PAID';
      if (q.includes('unpaid')) leaveType = 'UNPAID';

      return res.json({
        response: `📝 **Drafted ${leaveType} Leave Request**\n\nSubject: ${leaveType === 'SICK' ? 'Medical Leave' : 'Personal Leave'} Application – ${name}\n\nDear HR Manager,\n\nI am writing to request ${days} day(s) of ${leaveType.toLowerCase()} leave from ${tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.\n\nReason: ${q.includes('fever') ? 'Recovery from viral fever as advised by my physician.' : q.includes('family') ? 'Family commitment requiring my presence.' : 'Personal medical reasons requiring rest and recovery.'}\n\nI have ensured all pending tasks are either completed or delegated to my team. I will be reachable via email for any urgent matters.\n\nThank you for your consideration.\n\nBest regards,\n${name}\n\n---\n💡 *You can submit this leave from the Leave Tracker page.*`
      });
    }

    // === SALARY BREAKDOWN ===
    if (q.includes('salary') || q.includes('payroll') || q.includes('pay') || q.includes('compensation')) {
      if (role === 'ADMIN' && (q.includes('total') || q.includes('all') || q.includes('expenditure') || q.includes('allocation'))) {
        const payrolls = await prisma.payroll.findMany({
          include: { user: { select: { profile: { select: { firstName: true, lastName: true, department: true } } } } }
        });
        const totalGross = payrolls.reduce((s: number, p: any) => s + p.basicSalary + p.allowances, 0);
        const totalDeductions = payrolls.reduce((s: number, p: any) => s + p.deductions, 0);
        const totalNet = payrolls.reduce((s: number, p: any) => s + p.netSalary, 0);

        const deptMap: Record<string, number> = {};
        payrolls.forEach((p: any) => {
          const dept = p.user?.profile?.department || 'Unassigned';
          deptMap[dept] = (deptMap[dept] || 0) + p.netSalary;
        });

        const deptBreakdown = Object.entries(deptMap).map(([d, v]) => `  • ${d}: ₹${v.toLocaleString('en-IN')}`).join('\n');

        return res.json({
          response: `💰 **Monthly Payroll Expenditure Analysis**\n\nTotal Workforce: ${payrolls.length} employees\n\n**Aggregate Compensation:**\n• Gross Earnings: ₹${totalGross.toLocaleString('en-IN')}\n• Total Deductions: ₹${totalDeductions.toLocaleString('en-IN')}\n• Net Disbursal: ₹${totalNet.toLocaleString('en-IN')}\n\n**Department Allocation:**\n${deptBreakdown}\n\nAvg. Net Salary: ₹${payrolls.length > 0 ? Math.round(totalNet / payrolls.length).toLocaleString('en-IN') : 0} per employee`
        });
      }

      const payroll = await prisma.payroll.findUnique({ where: { userId } });
      if (!payroll) {
        return res.json({ response: '⚠️ No payroll record found for your account. Please contact HR to configure your compensation structure.' });
      }

      const gross = payroll.basicSalary + payroll.allowances;
      return res.json({
        response: `💰 **Your Monthly Salary Structure**\n\n| Component | Amount |\n|---|---|\n| Basic Salary | ₹${payroll.basicSalary.toLocaleString('en-IN')} |\n| Allowances (HRA + DA) | ₹${payroll.allowances.toLocaleString('en-IN')} |\n| **Gross Earnings** | **₹${gross.toLocaleString('en-IN')}** |\n| Deductions (PF + Tax) | - ₹${payroll.deductions.toLocaleString('en-IN')} |\n| **Take-Home Pay** | **₹${payroll.netSalary.toLocaleString('en-IN')}** |\n\nEffective since: ${new Date(payroll.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      });
    }

    // === ATTENDANCE / WORK HOURS ===
    if (q.includes('hours') || q.includes('attendance') || q.includes('shift') || q.includes('overtime') || q.includes('punctual') || q.includes('burnout')) {
      if (role === 'ADMIN' && (q.includes('today') || q.includes('turnout') || q.includes('workforce') || q.includes('summary') || q.includes('anomal') || q.includes('overtime') || q.includes('burnout'))) {
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        
        const todayAtt = await prisma.attendance.findMany({
          where: { workDate: { gte: todayStart, lte: todayEnd } },
          include: { user: { select: { profile: { select: { firstName: true, lastName: true } } } } }
        });
        
        const totalProfiles = await prisma.profile.count();
        const present = todayAtt.filter((a: any) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
        const onLeave = todayAtt.filter((a: any) => a.status === 'LEAVE').length;
        const rate = totalProfiles > 0 ? Math.round((present / totalProfiles) * 100) : 0;

        // Overtime detection (>9 hrs)
        const overtimeList = todayAtt.filter((a: any) => a.totalHours > 9).map((a: any) => 
          `  • ${a.user?.profile?.firstName || 'Employee'} ${a.user?.profile?.lastName || ''}: ${a.totalHours.toFixed(1)}h`
        );

        return res.json({
          response: `📊 **Today's Workforce Attendance Summary**\n\nTotal Registered: ${totalProfiles} employees\n• ✅ Present: ${present}\n• 🏖️ On Leave: ${onLeave}\n• ❌ Not Checked In: ${totalProfiles - present - onLeave}\n\n**Attendance Turnout Rate: ${rate}%**\n${overtimeList.length > 0 ? `\n⚠️ **Overtime Alert (>9h):**\n${overtimeList.join('\n')}` : '\n✅ No overtime anomalies detected.'}`
        });
      }

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const attendance = await prisma.attendance.findMany({
        where: { userId, workDate: { gte: monthStart, lte: now } },
        orderBy: { workDate: 'desc' }
      });

      const totalHours = attendance.reduce((s: number, a: any) => s + a.totalHours, 0);
      const presentDays = attendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
      const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : '0.0';
      const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      return res.json({
        response: `⏱️ **Your Attendance Report — ${monthName}**\n\n• Days Present: ${presentDays}\n• Total Hours Worked: ${totalHours.toFixed(1)}h\n• Average Daily Duration: ${avgHours}h\n• Target: 8.0h per day (160h / month)\n• Progress: ${Math.round((totalHours / 160) * 100)}% of monthly target\n\n${parseFloat(avgHours) >= 8 ? '✅ Excellent punctuality! You are meeting or exceeding the daily target.' : '⚡ Tip: Try to log at least 8 hours per workday to meet your monthly target.'}`
      });
    }

    // === PENDING LEAVES (ADMIN) ===
    if (role === 'ADMIN' && q.includes('pending') && q.includes('leave')) {
      const pendingLeaves = await prisma.leave.findMany({
        where: { status: 'PENDING' },
        include: { user: { select: { employeeId: true, profile: { select: { firstName: true, lastName: true, department: true } } } } },
        orderBy: { startDate: 'asc' }
      });

      if (pendingLeaves.length === 0) {
        return res.json({ response: '✅ No pending leave requests in the approval queue. All clear!' });
      }

      const list = pendingLeaves.map((l: any, i: number) => {
        const name = `${l.user?.profile?.firstName || ''} ${l.user?.profile?.lastName || ''}`.trim();
        const days = Math.ceil(Math.abs(new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / 86400000) + 1;
        return `${i + 1}. **${name}** (${l.user?.employeeId}) — ${l.leaveType} leave, ${days} day(s)\n   📅 ${new Date(l.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(l.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\n   💬 "${l.reason}"`;
      }).join('\n\n');

      return res.json({
        response: `📋 **Pending Leave Approval Queue (${pendingLeaves.length} requests)**\n\n${list}\n\n---\n💡 *Navigate to Leave Approvals to accept or reject these requests.*`
      });
    }

    // === GENERAL FALLBACK ===
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const name = profile ? profile.firstName : 'there';

    return res.json({
      response: `Hi ${name}! I understand you're asking about: "${query}"\n\nHere are some things I can help you with:\n\n• **Leave Balance** — "How many leave days do I have remaining?"\n• **Draft Leave** — "Draft a 2-day sick leave request"\n• **Salary Breakdown** — "Explain my monthly salary structure"\n• **Work Hours** — "What are my total hours this month?"\n${role === 'ADMIN' ? '• **Workforce Summary** — "Summarize today\'s attendance turnout"\n• **Pending Leaves** — "Review pending leave requests"\n• **Payroll Analysis** — "Analyze total compensation expenditure"' : ''}\n\nTry asking one of these questions!`
    });

  } catch (error) {
    console.error('AI query error:', error);
    return res.status(500).json({ error: 'Failed to process AI query. Please try again.' });
  }
};
