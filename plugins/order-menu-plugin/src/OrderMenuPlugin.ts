import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import MenuPage from './ui/MenuPage';
import { Menu } from './menuType';

interface OrderMenuPluginOptions {
  factory?: string;
  title?: string;
  description?: string;
  icon?: string | null;
}

export default class OrderMenuPlugin implements Plugin {
  private menuId: string;
  public asset: string;
  private factory: string;
  private title: string;
  private description: string;
  private icon: string | null;

  constructor(menuId: string, asset: string, {
    factory = 'https://burnerfactory.com',
    title = 'Order Food & Drinks',
    description = 'Purchase food & drinks with your tokens',
    icon = null,
  }: OrderMenuPluginOptions = {}) {
    this.menuId = menuId;
    this.asset = asset;
    this.factory = factory;
    this.title = title;
    this.description = description;
    this.icon = icon;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addButton('apps', this.title, '/menu', {
      description: this.description,
      icon: this.icon,
    });
    pluginContext.addPage('/menu/:vendorName?', MenuPage);
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
  }

  async getMenu() {
    const response = await fetch(`${this.factory}/menu/${this.menuId}`);
    const json = await response.json();
    return json.menu as Menu;
  }

  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
