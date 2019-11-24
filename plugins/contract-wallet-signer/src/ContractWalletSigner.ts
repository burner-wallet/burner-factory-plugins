import BurnerCore from '@burner-wallet/core';
import Signer from '@burner-wallet/core/signers/Signer';
import { padLeft, soliditySha3 } from 'web3-utils';

const arrayEquals = (a: string[], b: string[]) => a.length === b.length
  && a.reduce((current: boolean, val: string, i: number) => current && val === b[i], true);

const CREATION_CODE = '0x608060405234801561001057600080fd5b506040516105103803806105108339818101604052604081101561003357600080fd5b81019080805190602001909291908051906020019092919050505081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050610430806100e06000396000f3fe6080604052600436106100345760003560e01c806302d05d3f14610039578063a04a090814610090578063c45a0155146101ac575b600080fd5b34801561004557600080fd5b5061004e610203565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610131600480360360608110156100a657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156100e357600080fd5b8201836020820111156100f557600080fd5b8035906020019184600183028401116401000000008311171561011757600080fd5b909192939192939080359060200190929190505050610228565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610171578082015181840152602081019050610156565b50505050905090810190601f16801561019e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101b857600080fd5b506101c16103d5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806102d25750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b610344576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f4d7573742062652063616c6c6564206279207468652063726561746f7200000081525060200191505060405180910390fd5b600060608673ffffffffffffffffffffffffffffffffffffffff1684878760405180838380828437808301925050509250505060006040518083038185875af1925050503d80600081146103b4576040519150601f19603f3d011682016040523d82523d6000602084013e6103b9565b606091505b5091509150816103c857600080fd5b8092505050949350505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea265627a7a7230582042fc19937468d00dc6998acb6dc465ec8a33f9e59f98625d3566f85fd581a52864736f6c634300050a0032';

export default class ContractWalletSigner extends Signer {
  public factoryAddress: string;
  public innerFactoryAddress: string;
  private available: boolean;
  private _updating: boolean;

  constructor(factoryAddress: string) {
    super();
    this.factoryAddress = factoryAddress;
    this.innerFactoryAddress = this.calculateFactoryAddress();
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

  calculateFactoryAddress() {
    return '0x' + soliditySha3('0xd6', '0x94', this.factoryAddress, '0x01').substr(-40);
  }

  getWalletAddress(account: string) {
    const codeHash = soliditySha3(CREATION_CODE, padLeft(this.factoryAddress, 64), padLeft(account, 64));
    const salt = 0;
    return '0x' + soliditySha3('0xff', this.innerFactoryAddress, salt, codeHash).slice(-40);
  }
}
