import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import SchedulePage from './ui/SchedulePage';

export interface Day {
  day: string;
  events: Event[];
}

export interface Event {
  time: string;
  title?: string | null;
  details?: string | null;
}

export default class SechedulePlugin implements Plugin {
  private schedule: Day[];

  constructor(schedule: Day[]) {
    this.schedule = schedule;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/schedule/:day?', SchedulePage);
    pluginContext.addButton('apps', 'Schedule', '/schedule', {
      description: 'Follow the ETHWaterloo event schedule',
      logo: 'https://static.burnerfactory.com/icons/schedule.svg',
    });
  }

  async getSchedule(): Promise<Day[]> {
    return this.schedule;
  }
}
