import React from 'react';
import { Route } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import ScheduleDay from './ScheduleDay';

const ScheduleView: React.FC<{ schedule: any, day?: string }> = ({ schedule, day }) => {
  return (
    <div>
      <SwipeableRoutes>
        {schedule.map((day: any) => (
          <Route path={`/schedule/${day.day}`} key={day.day} render={() => (
            <ScheduleDay day={day} />
          )} />
        ))}
      </SwipeableRoutes>
    </div>
  );
};

export default ScheduleView;
