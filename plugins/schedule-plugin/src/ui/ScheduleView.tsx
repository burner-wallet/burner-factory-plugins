import React from 'react';
import { Route } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import { Day } from '../SchedulePlugin';
import ScheduleDay from './ScheduleDay';

interface ScheduleViewProps {
  schedule: Day[],
  day?: string,
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, day }) => {
  return (
    <div>
      <SwipeableRoutes>
        {schedule.map((day: Day, i: number) => (
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
