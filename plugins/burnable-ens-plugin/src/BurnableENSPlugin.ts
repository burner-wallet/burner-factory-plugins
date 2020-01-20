import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import ENSPanel from './ui/ENSPanel';
import { hash } from 'eth-ens-namehash';
import nameTokenABI from './abi/NameToken.json';
import reverseRegistrarABI from './abi/ReverseRegistrar.json';

const reverseRegistrars: { [network: string]: string } = {
  '1': '0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069',
  '3': '0x67d5418a000534a8F1f5FF4229cC2f439e63BBe2',
  '5': '0xa7caBE211BFE176235aBEbF13394c4a249681709',
};

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
  private resolver: string | null = null;
  private web3: any;

  constructor({ domain, tokenAddress, network = '1' }: ConstructorParams) {
    this.domain = domain;
    this.tokenAddress = tokenAddress;
    this.network = network;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-top', ENSPanel);

    this.web3 = pluginContext.getWeb3(this.network);
    this.tokenContract = new this.web3.eth.Contract(nameTokenABI as any, this.tokenAddress);
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
    const [resolver, balance] = await Promise.all([
      this.getResolver(),
      this.web3.eth.getBalance(account),
    ]);

    const transactions = [this.tokenContract.methods.register(name).send({ from: account })];

    if (balance !== '0') {
      transactions.push(this.getReverseRegistrar().methods.claimWithResolver(account, resolver)
        .send({ from: account }));
    }
    await Promise.all(transactions);
  }

  async burn(account: string) {
    const node = await this.tokenContract.methods.reverse(account).call();
    const token = await this.tokenContract.methods.resolveToken(node).call();
    await this.tokenContract.methods.burn(token).send({ from: account });
  }

  async getResolver() {
    if (!this.resolver) {
      this.resolver = await this.tokenContract.methods.resolver().call();
    }
    return this.resolver;
  }

  getReverseRegistrar() {
    if (!reverseRegistrars[this.network]) {
      throw new Error('Unsupported chain');
    }

    return new this.web3.eth.Contract(reverseRegistrarABI, reverseRegistrars[this.network]);
  }
}
