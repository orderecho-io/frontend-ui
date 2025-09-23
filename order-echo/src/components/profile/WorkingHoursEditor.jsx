import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultHours = daysOfWeek.map(day => ({ day, open: '09:00', close: '22:00', is_open: true }));

export default function WorkingHoursEditor({ initialHours, onHoursChange }) {
  const [hours, setHours] = useState(initialHours || defaultHours);

  const handleTimeChange = (day, type, value) => {
    const newHours = hours.map(h => {
      if (h.day === day) {
        return { ...h, [type]: value };
      }
      return h;
    });
    setHours(newHours);
    onHoursChange(newHours);
  };

  const handleOpenChange = (day, checked) => {
    const newHours = hours.map(h => {
      if (h.day === day) {
        return { ...h, is_open: checked };
      }
      return h;
    });
    setHours(newHours);
    onHoursChange(newHours);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Working Hours</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {daysOfWeek.map(day => {
          const dayData = hours.find(h => h.day === day) || { day, open: '09:00', close: '22:00', is_open: false };
          return (
            <div key={day} className="grid grid-cols-4 items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
              <Label className="font-medium col-span-1">{day}</Label>
              <div className="flex items-center gap-2 col-span-1">
                <Checkbox
                  id={`is_open_${day}`}
                  checked={dayData.is_open}
                  onCheckedChange={(checked) => handleOpenChange(day, checked)}
                />
                <Label htmlFor={`is_open_${day}`}>{dayData.is_open ? 'Open' : 'Closed'}</Label>
              </div>
              {dayData.is_open && (
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={dayData.open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                  />
                  <Input
                    type="time"
                    value={dayData.close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

