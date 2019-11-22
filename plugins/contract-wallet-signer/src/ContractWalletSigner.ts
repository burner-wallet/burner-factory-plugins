import BurnerCore from '@burner-wallet/core';
import Signer from '@burner-wallet/core/signers/Signer';

const arrayEquals = (a: string[], b: string[]) => a.length === b.length
  && a.reduce((current: boolean, val: string, i: number) => current && val === b[i], true);

export default class ContractWalletSigner extends Signer {
  private available: boolean;
  private _updating: boolean;

  constructor() {
    super();
    this.available = false;
    this._updating = false;
  }

  setCore(core: BurnerCore) {
    this.core = core;
    this.updateAccounts(core.getAccounts());
    core.onAccountChange((accounts: string[]) => this.updateAccounts(accounts));
  }

  isAvailable() {
    return this.accounts.length > 0;
  }

  signTx(tx: any) {
    return '';
  }

  updateAccounts(accounts: string[]) {
    if (this._updating) {
      return;
    }

    this._updating = true;
    const newAccounts: string[] = [];
    for (const account of accounts) {
      if (this.accounts.indexOf(account) === -1) {
        newAccounts.push(this.getWalletAddress(account));
      }
    }

    if (!arrayEquals(newAccounts, this.accounts)) {
      this.accounts = newAccounts;
      this.events.emit('accountChange');
    }
    this._updating = false;
  }

  getWalletAddress(account: string) {
    return `${account.substr(0, 40)}XX`;
  }
}
