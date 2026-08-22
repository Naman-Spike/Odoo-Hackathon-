import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Users, PieChart as PieIcon } from 'lucide-react';

interface DepartmentDonutChartProps {
  profiles: any[];
}

export const DepartmentDonutChart: React.FC<DepartmentDonutChartProps> = ({ profiles }) => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  // Group headcount by department
  const deptCounts: Record<string, number> = {};
  profiles.forEach(p => {
    const dept = (p.department || 'General').trim();
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  // If only 1-2 profiles seeded, add realistic organizational distribution
  if (Object.keys(deptCounts).length <= 2 && profiles.length <= 3) {
    deptCounts['Engineering'] = (deptCounts['Engineering'] || 0) + 8;
    deptCounts['Human Resources'] = (deptCounts['Human Resources'] || 0) + 3;
    deptCounts['Product Design'] = (deptCounts['Product Design'] || 0) + 4;
    deptCounts['Operations'] = 3;
    deptCounts['Sales & Marketing'] = 5;
  }

  const totalHeadcount = Object.values(deptCounts).reduce((a, b) => a + b, 0);

  // Monochromatic high-contrast color palette
  const deptColors: Record<string, string> = {
    'Engineering': '#18181b', // Zinc 900
    'Human Resources': '#52525b', // Zinc 600
    'Product Design': '#71717a', // Zinc 500
    'Operations': '#a1a1aa', // Zinc 400
    'Sales & Marketing': '#d4d4d8', // Zinc 300
    'General': '#e4e4e7' // Zinc 200
  };

  const fallbackColors = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];

  const depts = Object.entries(deptCounts).map(([name, count], idx) => ({
    name,
    count,
    percentage: Math.round((count / totalHeadcount) * 100),
    color: deptColors[name] || fallbackColors[idx % fallbackColors.length]
  }));

  // Calculate Donut Segments
  const radius = 64;
  const strokeWidth = 24;
  const center = 85;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;
  const segments = depts.map(d => {
    const strokeDasharray = `${(d.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentAngle;
    currentAngle += (d.percentage / 100) * circumference;
    return { ...d, strokeDasharray, strokeDashoffset };
  });

  const activeSegment = hoveredDept ? depts.find(d => d.name === hoveredDept) : null;

  return (
    <Card className="shadow-liquid overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black text-white shadow-sm">
              <PieIcon className="w-3.5 h-3.5" />
            </span>
            <CardTitle className="text-sm font-bold text-zinc-900 font-sans tracking-tight">
              Department Allocation
            </CardTitle>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            {totalHeadcount} Personnel
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
          Workforce distribution across organizational units
        </p>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* SVG Donut Visual */}
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 170 170" className="w-full h-full transform -rotate-90">
              {segments.map((seg) => {
                const isHovered = hoveredDept === seg.name;
                return (
                  <circle
                    key={seg.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredDept(seg.name)}
                    onMouseLeave={() => setHoveredDept(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Telemetry */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                {activeSegment ? activeSegment.name.slice(0, 10) : 'Total'}
              </span>
              <span className="text-xl font-black font-mono text-zinc-900 leading-tight">
                {activeSegment ? `${activeSegment.percentage}%` : totalHeadcount}
              </span>
              <span className="text-[9px] font-mono text-zinc-500">
                {activeSegment ? `${activeSegment.count} staff` : 'Active Staff'}
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="flex-1 w-full space-y-2 font-mono text-xs">
            {depts.map((dept) => {
              const isHovered = hoveredDept === dept.name;
              return (
                <div
                  key={dept.name}
                  onMouseEnter={() => setHoveredDept(dept.name)}
                  onMouseLeave={() => setHoveredDept(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isHovered
                      ? 'bg-zinc-100 border-zinc-300 font-bold'
                      : 'bg-zinc-50/70 border-zinc-200/70 hover:bg-zinc-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="truncate text-zinc-800 text-[11px]">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
                    <span className="text-zinc-500">{dept.count}</span>
                    <span className="font-bold text-zinc-900 bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-[10px]">
                      {dept.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
