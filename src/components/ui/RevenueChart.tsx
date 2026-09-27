"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#68736d' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#68736d' }} tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
          <Tooltip 
            cursor={{ fill: '#eef3ef' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#008b45" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
