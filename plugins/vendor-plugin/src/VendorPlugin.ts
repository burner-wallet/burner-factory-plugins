import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import VendorPage from './VendorPage';

const STORAGE_KEY = 'vendor-complete';

interface OrderMenuPluginOptions {
  factory?: string;
}

export default class OrderMenuPlugin implements Plugin {
  private menuId: string;
  private factory: string;
  private _menu: Promise<any> | null;
  private completeTx: string[];

  constructor(menuId: string, {
    factory = 'https://burnerfactory.com',
  }: OrderMenuPluginOptions = {}) {
    this.menuId = menuId;
    this.factory = factory;

    this._menu = null;
    this.completeTx = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addButton('apps', 'Vendor', '/vendor');
    pluginContext.addPage('/vendor', VendorPage);
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
    return json.menu as any;
  }

  setComplete(tx: string, complete: boolean) {
    if (complete && this.completeTx.indexOf(tx) === -1) {
      this.completeTx.push(tx);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.completeTx));
  }

  isComplete(tx: string) {
    return this.completeTx.indexOf(tx) !== -1;
  }
}
