import React from 'react';
import { Route } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import ScheduleDay from './ScheduleDay';

const ScheduleView: React.FC<{ schedule: any, day?: string }> = ({ schedule, day }) => {
  return (
    <div>
      <SwipeableRoutes>
        {schedule.map((day: any, i: number) => (
          <Route path={`/schedule/${day.day}`} key={day.day} render={() => (
            <ScheduleDay
              day={day}
              previousDay={(schedule[i - 1] || {}).day}
              nextDay={(schedule[i + 1] || {}).day}
            />
          )} />
        ))}
      </SwipeableRoutes>
    </div>
  );
};

export default ScheduleView;
