import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import MenuPage from './ui/MenuPage';

export default class OrderMenuPlugin implements Plugin {
  private menuId: string;
  private factory: string;
  private pluginContext?: BurnerPluginContext;

  constructor(menuId: string, factory: string = 'https://burnerfactory.com') {
    this.menuId = menuId;
    this.factory = factory;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
    pluginContext.addButton('apps', 'Menu', '/menu', { description: 'Buy some beer!' });
    pluginContext.addPage('/menu/:vendorName?', MenuPage);
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
  }


  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
