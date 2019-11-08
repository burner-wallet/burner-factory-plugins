import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import SchedulePage from './ui/SchedulePage';
import schedule from './waterloo.json';

export default class SechedulePlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/schedule/:day?', SchedulePage);
    pluginContext.addButton('apps', 'Schedule', '/schedule', {
      description: 'Follow the ETHWaterloo event schedule',
    });
  }

  async getSchedule(): Promise<any> {
    return schedule;
  }
}
