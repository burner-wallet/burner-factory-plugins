import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import SchedulePlugin, { Day } from '../SchedulePlugin';
import ScheduleView from './ScheduleView';

interface SchedulePageProps {
  day?: string;
}

const SchedulePage: React.FC<PluginPageContext<SchedulePageProps>> = ({ plugin, burnerComponents, match }) => {
  const [schedule, setSchedule] = useState<Day[] | null>(null);
  const _plugin = plugin as SchedulePlugin;

  useEffect(() => {
    _plugin.getSchedule().then((schedule: Day[]) => setSchedule(schedule));
  }, []);

  const { Page } = burnerComponents;
  return (
    <Page title="Schedule">
      {schedule ? (
        <ScheduleView schedule={schedule} day={match.params.day} />
      ) : 'Loading...'}
    </Page>
  );
}

export default SchedulePage;
