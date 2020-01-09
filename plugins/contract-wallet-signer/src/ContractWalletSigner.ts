import BurnerCore from '@burner-wallet/core';
import Signer from '@burner-wallet/core/signers/Signer';
import { padLeft, soliditySha3 } from 'web3-utils';
import factoryAbi from './factory-abi.json';
import walletAbi from './wallet-abi.json';
import Web3 from 'web3';

const arrayEquals = (a: string[], b: string[]) => a.length === b.length
  && a.reduce((current: boolean, val: string, i: number) => current && val === b[i], true);

const CREATION_CODE = '0x608060405234801561001057600080fd5b506040516104bb3803806104bb8339818101604052604081101561003357600080fd5b81019080805190602001909291908051906020019092919050505060405180807f6275726e65722d77616c6c65742d666163746f72790000000000000000000000815250601501905060405180910390207f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b146100af57fe5b6100be8261028860201b60201c565b6060600073ffffffffffffffffffffffffffffffffffffffff1663485cc955905060e01b8383604051602401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060006101c26102b760201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16826040518082805190602001908083835b6020831061020c57805182526020820191506020810190506020830392506101e9565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d806000811461026c576040519150601f19603f3d011682016040523d82523d6000602084013e610271565b606091505b505090508061027f57600080fd5b5050505061037d565b60007f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b90508181555050565b60006102c761034c60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b15801561030c57600080fd5b505afa158015610320573d6000803e3d6000fd5b505050506040513d602081101561033657600080fd5b8101908080519060200190929190505050905090565b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b9050805491505090565b61012f8061038c6000396000f3fe6080604052600a600c565b005b60186014601a565b60a4565b565b6000602260c9565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b158015606657600080fd5b505afa1580156079573d6000803e3d6000fd5b505050506040513d6020811015608e57600080fd5b8101908080519060200190929190505050905090565b3660008037600080366000845af43d6000803e806000811460c4573d6000f35b3d6000fd5b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b905080549150509056fea265627a7a723058208c08abafbddfffc81aac97ef5489e7b423dda0b243b2bdec730e3517087afd4064736f6c634300050a0032';

const OVERRIDE_STORAGE_KEY = 'contractWalletSignerOverride';

interface ContractWalletSignerOptions {
  useLocalStorage?: boolean;
  creationCode?: string;
}

interface Override {
  address: string;
  signature: string;
}

export default class ContractWalletSigner extends Signer {
  public factoryAddress: string;
  public innerFactoryAddress: string;
  private creationCode: string;
  private _updating: boolean;
  private walletOwner: { [walletAddress: string]: string };
  private walletSignerOverride: { [walletAddress: string]: Override };
  public isEnabled: boolean;
  private useLocalStorage: boolean;

  constructor(factoryAddress: string, {
    useLocalStorage = true,
    creationCode = CREATION_CODE,
  }: ContractWalletSignerOptions = {}) {
    super({ id: 'contract' });
    this.factoryAddress = factoryAddress;
    this.innerFactoryAddress = this.calculateFactoryAddress();
    this._updating = false;
    this.walletOwner = {};
    this.creationCode = creationCode;
    this.isEnabled = true;
    this.useLocalStorage = useLocalStorage;

    this.walletSignerOverride = JSON.parse(
      (useLocalStorage && localStorage.getItem(OVERRIDE_STORAGE_KEY)) || '{}');
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
    return ['getOwner', 'isEnabled', 'enable', 'disable', 'isContractWallet'];
  }

  invoke(action: string, address: string) {
    switch (action) {
      case 'getOwner':
        return this.walletOwner[address];
      case 'setSignerOverride':
        // TODO: update once burner-core defs are updated
        return this.setSignerOverride(address, arguments[2] as string);
      case 'getSignerOverride':
        return this.walletSignerOverride[address] ? this.walletSignerOverride[address].address : null;
      case 'isEnabled':
        return this.isEnabled;
      case 'enable':
        this.isEnabled = true;
        this.updateAccounts(this.core!.getAccounts());
        return;
      case 'disable':
        this.isEnabled = false;
        this.updateAccounts([]);
        return;
      case 'isContractWallet':
        return true;
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  getFactory(chainId?: string) {
    const web3 = chainId ? this.core!.getWeb3(chainId) : new Web3();
    const factory = new web3.eth.Contract(factoryAbi as any, this.factoryAddress);
    return factory;
  }

  getWallet(chainId?: string, address?: string) {
    const web3 = chainId ? this.core!.getWeb3(chainId) : new Web3();
    const wallet = new web3.eth.Contract(walletAbi as any, address);
    return wallet;
  }

  async signTx(tx: any) {
    const walletAddress = tx.from;
    const web3 = this.core!.getWeb3(tx.chainId);
    const factory = this.getFactory(tx.chainId);
    const wallet = this.getWallet(tx.chainId, walletAddress);

    const txData = tx.data || '0x';
    const value = tx.value || '0x0';

    const owner = this.walletOwner[walletAddress];
    let data, fromAddress;
    let to = this.factoryAddress;

    const override = this.walletSignerOverride[walletAddress];
    if (override) {
      fromAddress = override.address;
      const targetContractCode = await web3.eth.getCode(walletAddress);
      const isContractDeployed = targetContractCode !== '0x';

      const isOwner = isContractDeployed && await wallet.methods.isOwner(override.address).call();
      if (isOwner) {
        to = walletAddress;
        data = wallet.methods.execute(tx.to, txData, value).encodeABI();
      } else {
        const ownerContract = this.getWalletAddress(override.address);

        const addOwnerData = factory.methods.executeWithSignature(
          walletAddress,
          walletAddress,
          wallet.methods.addOwner(override.address).encodeABI(),
          '0',
          override.signature,
        ).encodeABI();

        const { data: executeWithOverrideSignatureData } = await this.getExecuteWithSignatureValues(
          walletAddress, tx.to, txData, value, override.address);

        const batchAddresses = [this.factoryAddress, this.factoryAddress];
        const batchData = [
          addOwnerData,
          executeWithOverrideSignatureData,
        ];
        const batchValues = ['0', '0'];

        if (!isContractDeployed) {
          batchAddresses.unshift(this.factoryAddress);
          batchData.unshift(factory.methods.createWallet(owner).encodeABI());
          batchValues.unshift('0');
        }

        const multiTxCall = wallet.methods.executeBatch(
          batchAddresses,
          '0x' + batchData.map((str: string) => str.substr(2)).join(''),
          batchData.map((str: string) => (str.length - 2) / 2),
          batchValues,
        ).encodeABI();
        data = factory.methods.createAndExecute(ownerContract, multiTxCall, '0').encodeABI();
      }
    } else {
      fromAddress = owner;
      data = factory.methods.createAndExecute(tx.to, txData, value).encodeABI()
    }

    const newTx: any = {
      data,
      from: fromAddress,
      to,
      nonce: await web3.eth.getTransactionCount(fromAddress),
      gasPrice: tx.gasPrice,
    };
    newTx.gas = await web3.eth.estimateGas(newTx);
    newTx.chainId = tx.chainId;
    const signed = await this.core!.signTx(newTx);
    return signed;
  }

  async setSignerOverride(walletAddress: string, newSigner: string) {
    const primarySigner = this.walletOwner[walletAddress];
    const wallet = this.getWallet();
    const data = wallet.methods.addOwner(newSigner).encodeABI();
    const { signature } = await this.getExecuteWithSignatureValues(
      walletAddress, walletAddress, data, '0', primarySigner);

    this.setOverride(walletAddress, signature, newSigner);
  }

  async getExecuteWithSignatureValues(
    walletAddress: string, target: string, data: string, value: string, signer: string
  ) {
    const factory = this.getFactory();
    const hash = soliditySha3(walletAddress, target, data, '0');
    const signature = await this.core!.signMsg(hash, signer);

    const executeData = factory.methods.executeWithSignature(
      walletAddress, target, data, value, signature).encodeABI();

    return { signature, data: executeData }
  }

  setOverride(walletAddress: string, signature: string, address: string) {
    this.walletSignerOverride[walletAddress] = { signature, address };
    if (this.useLocalStorage) {
      window.localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(this.walletSignerOverride));
    }
  }

  updateAccounts(accounts: string[]) {
    if (this._updating) {
      return;
    }

    this._updating = true;
    const newAccounts: string[] = [];

    if (this.isEnabled) {
      for (const account of accounts) {
        if (this.accounts.indexOf(account) === -1) {
          const walletAddress = this.getWalletAddress(account);
          this.walletOwner[walletAddress] = account;
          newAccounts.push(walletAddress);
        }
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
