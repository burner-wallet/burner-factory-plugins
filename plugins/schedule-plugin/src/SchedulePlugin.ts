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
  private description?: string;

  constructor(schedule: Day[], { description }: { description?: string } = {}) {
    this.schedule = schedule;
    this.description = description;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/schedule/:day?', SchedulePage);
    pluginContext.addButton('apps', 'Schedule', '/schedule', {
      description: this.description || 'Follow the event schedule',
      logo: 'https://static.burnerfactory.com/icons/schedule.svg',
    });
  }

  async getSchedule(): Promise<Day[]> {
    return this.schedule;
  }
}
