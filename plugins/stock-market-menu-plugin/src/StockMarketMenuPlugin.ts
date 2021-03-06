import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import { Asset } from '@burner-wallet/assets';
import { toUtf8, fromUtf8, fromWei, toBN, padLeft } from 'web3-utils';
import MenuPage from './ui/MenuPage';
import OrdersPage from './ui/OrdersPage';
import marketAbi from './abi/Market.json';
import funnyName from './name';

export interface Drink {
  id: string;
  name: string;
}

export interface Metadata {
  price: string;
  displayPrice: string;
  lastPurchase: Date;
  insufficent: boolean;
}

export interface Order {
  name: string;
  price: string;
  displayPrice: string;
  buyer: string;
  tx: string;
  completed: boolean;
}

const BEER = String.fromCodePoint(0x1F37A);

export default class StockMarketMenuPlugin implements Plugin {
  public marketAddress: string;
  public paymentAsset: string;
  // @ts-ignore
  public name: string;
  public adminMode: boolean;
  private network: string;
  private pluginContext?: BurnerPluginContext;
  private drinks?: Drink[];
  private asset?: Asset;
  private completed: { [id: string]: boolean };
  public historicPrices: { [id: string]: number[] };

  constructor(marketAddress: string, paymentAsset: string, network: string = '100', adminMode: boolean = false) {
    let name = localStorage.getItem('stock-name');
    if (name) {
      this.name = name;
    } else {
      this.setName(funnyName());
    }

    this.completed = JSON.parse(localStorage.getItem('completedOrders') || '{}')!;
    this.marketAddress = marketAddress;
    this.paymentAsset = paymentAsset;
    this.network = network;
    this.adminMode = adminMode;
    this.historicPrices = {};
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
    pluginContext.addButton('apps', `${BEER} Menu`, '/stock-market', { description: 'Buy some beer!' });
    pluginContext.addPage('/stock-market/orders', OrdersPage);
    pluginContext.addPage('/stock-market', MenuPage);
    pluginContext.onAccountSearch(query => this.vendorSearch(query));

    const [asset] = pluginContext.getAssets().filter((asset: Asset) => asset.id === this.paymentAsset);
    this.asset = asset;
    if (!asset) {
      throw new Error(`Unrecognized asset ${this.paymentAsset}`);
    }
  }

  setName(name: string) {
    this.name = name;
    localStorage.setItem('stock-name', name);
  }

  getMarketContract(): any {
    const web3 = this.pluginContext!.getWeb3(this.network);
    return new web3.eth.Contract(marketAbi as any, this.marketAddress);
  }

  async getDrinks(): Promise<Drink[]> {
    if (!this.drinks) {
      const events = await this.getMarketContract().getPastEvents('AddDrink', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      this.drinks = events.map((event: any) => ({
        id: event.returnValues._id.toString(),
        name: toUtf8(event.returnValues._name),
      }));
    }
    return this.drinks!;
  }

  async getMetadata(drinkId: string, sender: string): Promise<Metadata> {
    const contract = this.getMarketContract();
    const [price, lastPurchase, balance] = await Promise.all([
      contract.methods.getPrice(drinkId).call(),
      contract.methods.getLastPurchase(drinkId).call(),
      this.asset!.getBalance(sender),
    ]);
    const insufficent = toBN(balance).lt(toBN(price));

    return {
      price: price.toString(),
      displayPrice: fromWei(price.toString(), 'ether'),
      lastPurchase: new Date(parseInt(lastPurchase) * 1000),
      insufficent,
    }
  }

  async buy(fromAccount: string, drinkId: string) {
    const contract = this.getMarketContract();
    const price = await contract.methods.getPrice(drinkId).call();
    const roundedPrice = toBN(price).mul(toBN('12')).div(toBN('10')).toString();

    const web3 = this.pluginContext!.getWeb3(this.network);
    const data = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [drinkId, padLeft(fromUtf8(this.name), 64)]);

    const assetContract = (this.asset as any).getContract();//.getGaslessContract();
    const receipt = await assetContract.methods.send(this.marketAddress, roundedPrice, data).send({ from: fromAccount });
    console.log(receipt);
  }

  setCompleted(id: string, completed: boolean) {
    this.completed[id] = completed;
    localStorage.setItem('completedOrders', JSON.stringify(this.completed));
  }

  async getOrders(user: string): Promise<Order[]> {
    const events = await this.getMarketContract().getPastEvents('BuyDrink', {
      fromBlock: 0,
      toBlock: 'latest',
      filter: this.adminMode ? {} : { buyer: user },
    });
    return events.map((event: any) => ({
      price: event.returnValues.price.toString(),
      displayPrice: fromWei(event.returnValues.price.toString(), 'ether'),
      name: toUtf8(event.returnValues.drinkName),
      buyer: toUtf8(event.returnValues.buyername),
      tx: event.transactionHash,
      completed: !!this.completed[event.transactionHash],
    }));
  }

  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
