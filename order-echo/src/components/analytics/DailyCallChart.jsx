import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';

export default function DailyCallChart({ calls }) {
  // Generate last 14 days of data
  const endDate = new Date();
  const startDate = subDays(endDate, 13);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const dailyData = dateRange.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayCalls = calls.filter(call => format(new Date(call.created_date), 'yyyy-MM-dd') === dateStr);
    
    const answered = dayCalls.filter(c => c.status === 'answered').length;
    const missed = dayCalls.filter(c => c.status === 'missed').length;
    const voicemail = dayCalls.filter(c => c.status === 'voicemail').length;
    
    return {
      date: format(date, 'MM/dd'),
      fullDate: format(date, 'MMM dd, yyyy'),
      answered,
      missed,
      voicemail,
      total: answered + missed + voicemail
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullDate}</p>
          <div className="mt-2 space-y-1">
            <p className="text-green-600">Answered: {data.answered}</p>
            <p className="text-red-600">Missed: {data.missed}</p>
            <p className="text-blue-600">Voicemail: {data.voicemail}</p>
            <p className="font-medium border-t pt-1">Total: {data.total}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="answered" stackId="a" fill="#10B981" name="Answered" />
          <Bar dataKey="missed" stackId="a" fill="#EF4444" name="Missed" />
          <Bar dataKey="voicemail" stackId="a" fill="#3B82F6" name="Voicemail" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

