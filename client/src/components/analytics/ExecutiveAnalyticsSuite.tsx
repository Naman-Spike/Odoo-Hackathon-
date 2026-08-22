import React from 'react';
import { AttendanceVelocityChart } from './AttendanceVelocityChart';
import { DepartmentDonutChart } from './DepartmentDonutChart';
import { PayrollExpenditureChart } from './PayrollExpenditureChart';
import { LeaveUtilizationGauge } from './LeaveUtilizationGauge';
import { PunctualityMetricsCard } from './PunctualityMetricsCard';
import { Button } from '../ui/Button';
import { Download, Sparkles, Printer, BarChart3 } from 'lucide-react';

interface AnalyticsSuiteProps {
  attendanceData: any[];
  profiles: any[];
  leaves: any[];
  payrolls: any[];
}

export const ExecutiveAnalyticsSuite: React.FC<AnalyticsSuiteProps> = ({
  attendanceData,
  profiles,
  leaves,
  payrolls
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const summaryRows = [
      ['Metric', 'Value'],
      ['Total Active Headcount', profiles.length.toString()],
      ['Total Monthly Payroll Disbursed', payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0).toString()],
      ['Total Leave Applications', leaves.length.toString()],
      ['Pending Leave Requests', leaves.filter(l => l.status === 'PENDING').length.toString()],
      ['Approved Leave Requests', leaves.filter(l => l.status === 'APPROVED').length.toString()],
      ['Attendance Records Logged', attendanceData.length.toString()]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + summaryRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dayflow-executive-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono mb-2 border border-white/15">
            <Sparkles className="w-3 h-3 text-white" />
            EXECUTIVE INTELLIGENCE ENGINE
          </div>
          <h2 className="text-xl font-extrabold font-sans tracking-tight">
            Workforce Telemetry & Visual Analytics
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            High-fidelity data telemetry across attendance, compensation, and team bandwidth
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportSummaryCSV}
            icon={Download}
            className="text-white hover:bg-white/10 hover:text-white border border-white/20 font-mono text-xs"
          >
            Export Telemetry
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
            className="bg-white text-black hover:bg-zinc-100 font-mono text-xs font-bold"
          >
            Print Dossier
          </Button>
        </div>
      </div>

      {/* Row 1: Velocity Trend (Full Width) */}
      <AttendanceVelocityChart
        attendanceData={attendanceData}
        totalEmployees={profiles.length}
      />

      {/* Row 2: Department Donut & Payroll Inflow/Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentDonutChart profiles={profiles} />
        <PayrollExpenditureChart payrolls={payrolls} />
      </div>

      {/* Row 3: Leave Quotas & Punctuality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaveUtilizationGauge leaves={leaves} />
        <PunctualityMetricsCard attendanceRecords={attendanceData} />
      </div>
    </div>
  );
};
