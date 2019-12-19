import BurnerCore from '@burner-wallet/core';
import Signer from '@burner-wallet/core/signers/Signer';
import { padLeft, soliditySha3 } from 'web3-utils';
import factoryAbi from './factory-abi.json';

const arrayEquals = (a: string[], b: string[]) => a.length === b.length
  && a.reduce((current: boolean, val: string, i: number) => current && val === b[i], true);

const CREATION_CODE = '0x608060405234801561001057600080fd5b506040516104bb3803806104bb8339818101604052604081101561003357600080fd5b81019080805190602001909291908051906020019092919050505060405180807f6275726e65722d77616c6c65742d666163746f72790000000000000000000000815250601501905060405180910390207f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b146100af57fe5b6100be8261028860201b60201c565b6060600073ffffffffffffffffffffffffffffffffffffffff1663485cc955905060e01b8383604051602401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060006101c26102b760201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16826040518082805190602001908083835b6020831061020c57805182526020820191506020810190506020830392506101e9565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d806000811461026c576040519150601f19603f3d011682016040523d82523d6000602084013e610271565b606091505b505090508061027f57600080fd5b5050505061037d565b60007f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b90508181555050565b60006102c761034c60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b15801561030c57600080fd5b505afa158015610320573d6000803e3d6000fd5b505050506040513d602081101561033657600080fd5b8101908080519060200190929190505050905090565b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b9050805491505090565b61012f8061038c6000396000f3fe6080604052600a600c565b005b60186014601a565b60a4565b565b6000602260c9565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b158015606657600080fd5b505afa1580156079573d6000803e3d6000fd5b505050506040513d6020811015608e57600080fd5b8101908080519060200190929190505050905090565b3660008037600080366000845af43d6000803e806000811460c4573d6000f35b3d6000fd5b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b905080549150509056fea265627a7a723058208c08abafbddfffc81aac97ef5489e7b423dda0b243b2bdec730e3517087afd4064736f6c634300050a0032';

interface ContractWalletSignerOptions {
  useLocalStorage?: boolean;
  creationCode?: string;
}

export default class ContractWalletSigner extends Signer {
  public factoryAddress: string;
  public innerFactoryAddress: string;
  private creationCode: string;
  private available: boolean;
  private _updating: boolean;
  private walletOwner: { [walletAddress: string]: string };

  constructor(factoryAddress: string, {
    useLocalStorage = true,
    creationCode = CREATION_CODE,
  }: ContractWalletSignerOptions = {}) {
    super();
    this.factoryAddress = factoryAddress;
    this.innerFactoryAddress = this.calculateFactoryAddress();
    this.available = false;
    this._updating = false;
    this.walletOwner = {};
    this.creationCode = creationCode;
    this.walletSignerOverride = JSON.parse(
      (useLocalStorage && localStorage.getItem('contractWalletSignerOverride')) || '{}');
  }

  setCore(core: BurnerCore) {
    this.core = core;
    this.updateAccounts(core.getAccounts());
    core.onAccountChange((accounts: string[]) => this.updateAccounts(accounts));
  }

  isAvailable() {
    return this.accounts.length > 0;
  }

  permissions() {
    return ['getOwner'];
  }

  invoke(action: string, address: string) {
    switch (action) {
      case 'getOwner':
        return this.walletOwner[address];
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  getFactory(chainId: string) {
    const web3 = this.core!.getWeb3(chainId);
    const factory = new web3.eth.Contract(factoryAbi as any, this.factoryAddress);
    return factory;
  }

  async signTx(tx: any) {
    const web3 = this.core!.getWeb3(tx.chainId);
    const factory = this.getFactory(tx.chainId);

    const txData = tx.data || '0x';
    const value = tx.value || '0x0';
    const methodCall = factory.methods.createAndExecute(tx.to, txData, value);

    const fromAddress = this.walletOwner[tx.from];
    const data = methodCall.encodeABI();
    const gas = await methodCall.estimateGas({ from: fromAddress });

    const newTx = {
      data,
      gas,
      from: fromAddress,
      to: this.factoryAddress,
      nonce: await web3.eth.getTransactionCount(fromAddress),
      gasPrice: tx.gasPrice,
      chainId: tx.chainId,
    };
    const signed = await this.core!.signTx(newTx);
    return signed;
  }

  updateAccounts(accounts: string[]) {
    if (this._updating) {
      return;
    }

    this._updating = true;
    const newAccounts: string[] = [];
    for (const account of accounts) {
      if (this.accounts.indexOf(account) === -1) {
        const walletAddress = this.getWalletAddress(account);
        this.walletOwner[walletAddress] = account;
        newAccounts.push(walletAddress);
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
