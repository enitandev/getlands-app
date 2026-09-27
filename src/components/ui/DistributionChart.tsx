"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function DistributionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-[#68736d] text-[13px]">No data available</div>;
  }

  return (
    <div className="h-[250px] w-full flex items-center">
      <div className="w-[200px] h-full shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Volume']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-[15px] pl-[10px]">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-[10px]">
            <div className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: item.color }}></div>
            <div className="flex-1">
              <div className="text-[12px] text-[#68736d] font-bold uppercase tracking-wider">{item.name}</div>
              <div className="text-[15px] font-manrope font-bold text-ink">₦{item.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
