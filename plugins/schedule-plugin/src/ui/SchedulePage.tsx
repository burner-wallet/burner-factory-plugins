import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import SchedulePlugin from '../SchedulePlugin';
import ScheduleView from './ScheduleView';

const SchedulePage: React.FC<PluginPageContext> = ({ plugin, burnerComponents, match }) => {
  const [schedule, setSchedule] = useState<any>(null);

  const _plugin = plugin as SchedulePlugin;

  useEffect(() => {
    _plugin.getSchedule().then((schedule: any) => setSchedule(schedule));
  }, []);

  const { day } = match.params as any;

  const { Page } = burnerComponents;
  return (
    <Page title="Schedule">
      {schedule ? (
        <ScheduleView schedule={schedule} day={day} />
      ) : 'Loading...'}
    </Page>
  );
}

export default SchedulePage;
