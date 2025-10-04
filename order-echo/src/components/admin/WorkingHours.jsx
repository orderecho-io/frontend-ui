import React from 'react';
import { Clock, Calendar } from 'lucide-react';

const WorkingHours = ({ accountDetails, isEditing, editedHours, setEditedHours }) => {
  if (!accountDetails?.working_hours || accountDetails.working_hours.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Working Hours Set</h3>
        <p className="text-gray-600">Working hours have not been configured for this restaurant.</p>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleHourChange = (day, field, value) => {
    setEditedHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Create a map of working hours by day
  const hoursByDay = {};
  accountDetails.working_hours.forEach(hours => {
    hoursByDay[hours.day_of_week] = hours;
  });

  return (
    <div>
      <div className="flex items-center mb-6">
        <Clock className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Working Hours</h3>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const dayHours = hoursByDay[day] || { 
            day_of_week: day, 
            is_open: false, 
            open_time: '09:00', 
            close_time: '21:00' 
          };
          
          return (
            <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
              <div className="w-24">
                <span className="font-medium text-gray-900">{day}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedHours[day]?.is_open ?? dayHours.is_open}
                    onChange={(e) => handleHourChange(day, 'is_open', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={dayHours.is_open}
                    readOnly
                    className="rounded border-gray-300 text-blue-600"
                  />
                )}
                <span className="text-sm text-gray-600">Open</span>
              </div>
              
              {(isEditing ? (editedHours[day]?.is_open ?? dayHours.is_open) : dayHours.is_open) && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">From:</span>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedHours[day]?.open_time || dayHours.open_time || '09:00'}
                        onChange={(e) => handleHourChange(day, 'open_time', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                        {formatTime(dayHours.open_time)}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-gray-400">to</span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">To:</span>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedHours[day]?.close_time || dayHours.close_time || '21:00'}
                        onChange={(e) => handleHourChange(day, 'close_time', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                        {formatTime(dayHours.close_time)}
                      </span>
                    )}
                  </div>
                </>
              )}
              
              {!(isEditing ? (editedHours[day]?.is_open ?? dayHours.is_open) : dayHours.is_open) && (
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-md text-sm font-medium">
                  Closed
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {isEditing && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                const allOpen = {};
                days.forEach(day => {
                  allOpen[day] = { is_open: true, open_time: '09:00', close_time: '17:00' };
                });
                setEditedHours(allOpen);
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Set All 9-5
            </button>
            <button
              type="button"
              onClick={() => {
                const allOpen = {};
                days.forEach(day => {
                  allOpen[day] = { is_open: true, open_time: '08:00', close_time: '22:00' };
                });
                setEditedHours(allOpen);
              }}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              Set All 8-10
            </button>
            <button
              type="button"
              onClick={() => {
                const weekdaysOnly = {};
                days.forEach(day => {
                  const isWeekend = day === 'Saturday' || day === 'Sunday';
                  weekdaysOnly[day] = { 
                    is_open: !isWeekend, 
                    open_time: '09:00', 
                    close_time: '17:00' 
                  };
                });
                setEditedHours(weekdaysOnly);
              }}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
            >
              Weekdays Only
            </button>
            <button
              type="button"
              onClick={() => {
                const allClosed = {};
                days.forEach(day => {
                  allClosed[day] = { is_open: false, open_time: '09:00', close_time: '17:00' };
                });
                setEditedHours(allClosed);
              }}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Close All
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Hours Summary</h4>
        <div className="text-sm text-blue-700">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Open Days:</span> {
                Object.values(hoursByDay).filter(h => h.is_open).length
              } / 7
            </div>
            <div>
              <span className="font-medium">Total Hours/Week:</span> {
                Object.values(hoursByDay)
                  .filter(h => h.is_open)
                  .reduce((total, h) => {
                    if (!h.open_time || !h.close_time) return total;
                    const [openHour, openMin] = h.open_time.split(':').map(Number);
                    const [closeHour, closeMin] = h.close_time.split(':').map(Number);
                    const openMinutes = openHour * 60 + openMin;
                    const closeMinutes = closeHour * 60 + closeMin;
                    const dailyMinutes = closeMinutes - openMinutes;
                    return total + (dailyMinutes > 0 ? dailyMinutes / 60 : 0);
                  }, 0)
                  .toFixed(1)
              } hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;
