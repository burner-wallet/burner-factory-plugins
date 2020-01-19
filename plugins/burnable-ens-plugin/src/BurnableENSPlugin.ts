import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import ENSPanel from './ui/ENSPanel';
import { hash } from 'eth-ens-namehash';
import nameTokenABI from './abi/NameToken.json';

interface ConstructorParams {
  domain: string;
  tokenAddress: string;
  network?: string;
}

export default class OrderMenuPlugin implements Plugin {
  public domain: string;
  private tokenAddress: string;
  private network: string;
  private tokenContract: any;

  constructor({ domain, tokenAddress, network = '1' }: ConstructorParams) {
    this.domain = domain;
    this.tokenAddress = tokenAddress;
    this.network = network;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-top', ENSPanel);

    const web3 = pluginContext.getWeb3(this.network);
    this.tokenContract = new web3.eth.Contract(nameTokenABI as any, this.tokenAddress);
  }

  async getName(account: string) {
    const name = await this.tokenContract.methods.name(account).call();
    return name.length > 0 ? name : null;
  }

  async isAvailable(name: string) {
    const node = hash(`${name}.${this.domain}`);
    const token = await this.tokenContract.methods.resolveToken(node).call();
    console.log({ token });
    return token === 0;
  }

  async register(name: string, account: string) {
    await this.tokenContract.methods.register(name).send({ from: account });
  }

  async burn(account: string) {
    const node = await this.tokenContract.methods.reverse(account).call();
    const token = await this.tokenContract.methods.resolveToken(node).call();
    await this.tokenContract.methods.burn(token).send({ from: account });
  }
}
