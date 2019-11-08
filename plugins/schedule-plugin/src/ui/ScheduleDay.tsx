import React from 'react';

const ScheduleDay: React.FC<{ day: any }> = ({ day }) => {
  return (
    <div>
      <div>{day.day}</div>
      {day.events.map((event: any) => (
        <div>
          <div>{event.time}</div>
          <div>{event.title}</div>
          <div>{event.location}</div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDay;
