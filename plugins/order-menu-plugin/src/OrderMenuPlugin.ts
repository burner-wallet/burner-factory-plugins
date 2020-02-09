import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import MenuPage from './ui/MenuPage';
import SetNamePage from './ui/SetNamePage';
import { Menu, Vendor } from './menuType';

interface OrderMenuPluginOptions {
  factory?: string;
  title?: string;
  description?: string;
  icon?: string | null;
  hideButton?: boolean;
}
const NAME_KEY = 'burner-vendor-name';

export default class OrderMenuPlugin implements Plugin {
  private menuId: string;
  private factory: string;
  private title: string;
  private description: string;
  private icon: string | null;
  private _menu: Promise<Menu> | null;
  public name: string | null;
  private hideButton: boolean;

  constructor(menuId: string, {
    factory = 'https://burnerfactory.com',
    title = 'Order Food & Drinks',
    description = 'Purchase food & drinks with your tokens',
    icon = null,
    hideButton = false,
  }: OrderMenuPluginOptions = {}) {
    this.menuId = menuId;
    this.factory = factory;
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.name = window.localStorage.getItem(NAME_KEY) || null;
    this.hideButton = hideButton;

    this._menu = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/menu/set-name', SetNamePage);
    pluginContext.addPage('/menu/:vendorName?', MenuPage);
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
    pluginContext.addAddressToNameResolver((address: string) => this.lookupName(address));

    if (!this.hideButton) {
      pluginContext.addButton('apps', this.title, '/menu', {
        description: this.description,
        icon: this.icon,
      });
    }
  }

  getMenu() {
    if (!this._menu) {
      this._menu = this._getMenu();
    }
    return this._menu;
  }

  async _getMenu() {
    const response = await fetch(`${this.factory}/menu/${this.menuId}`);
    const json = await response.json();
    return json.menu as Menu;
  }

  async vendorSearch(query: string): Promise<Account[]> {
    const menu = await this.getMenu();
    return menu.vendors
      .filter((vendor: Vendor) => vendor.name.toLowerCase().indexOf(query.toLowerCase()) === 0)
      .map((vendor: Vendor) => ({ name: vendor.name, address: vendor.recipient }));
  }

  async lookupName(address: string) {
    const menu = await this.getMenu();
    for (const vendor of menu.vendors) {
      if (vendor.recipient.toLowerCase() === address.toLowerCase()) {
        return vendor.name;
      }
    }
    return null;
  }

  setName(newName: string) {
    this.name = newName;
    window.localStorage.setItem(NAME_KEY, newName);
  }
}
