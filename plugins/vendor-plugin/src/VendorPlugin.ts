import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import VendorPage from './VendorPage';

const STORAGE_KEY = 'vendor-complete';

interface OrderMenuPluginOptions {
  factory?: string;
}

export default class VendorPlugin implements Plugin {
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

  getMenu(refresh = false) {
    if (!this._menu || refresh) {
      this._menu = this._getMenu();
    }
    return this._menu;
  }

  async _getMenu() {
    const response = await fetch(`${this.factory}/menu/${this.menuId}`);
    const json = await response.json();
    return json.menu as any;
  }

  async setIsOpen(vendorIndex: number, isOpen: boolean) {
    const response = await fetch(`${this.factory}/menu/${this.menuId}/setOpen`, {
      method: 'POST',
      body: JSON.stringify({ vendorIndex, isOpen }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setComplete(tx: string, complete: boolean) {
    const txIndex = this.completeTx.indexOf(tx)
    if (complete && txIndex === -1) {
      this.completeTx.push(tx);
    } else if (!complete && txIndex !== -1) {
      this.completeTx.splice(txIndex, 1);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.completeTx));
  }

  isComplete(tx: string) {
    return this.completeTx.indexOf(tx) !== -1;
  }

  async setAvailable(vendorIndex: number, itemIndex: number, available: boolean) {
    const response = await fetch(`${this.factory}/menu/${this.menuId}/setAvailable`, {
      method: 'POST',
      body: JSON.stringify({ vendorIndex, itemIndex, available }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
