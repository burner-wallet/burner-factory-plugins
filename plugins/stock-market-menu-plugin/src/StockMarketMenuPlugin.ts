import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import { toUtf8, fromWei } from 'web3-utils';
import MenuPage from './ui/MenuPage';
import marketAbi from './abi/Market.json';

export interface Drink {
  id: string;
  name: string;
}

export interface Metadata {
  price: string;
  displayPrice: string;
  lastPurchase: Date;
}

export default class StockMarketMenuPlugin implements Plugin {
  private marketAddress: string;
  private network: string;
  private pluginContext?: BurnerPluginContext;
  private drinks?: Drink[];

  constructor(marketAddress: string, network: string = '100') {
    this.marketAddress = marketAddress;
    this.network = network;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
    pluginContext.addButton('apps', 'Menu', '/menu', { description: 'Buy some beer!' });
    pluginContext.addPage('/menu/:vendorName?', MenuPage);
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
  }

  getMarketContract() {
    const web3 = this.pluginContext!.getWeb3(this.network);
    return new web3.eth.Contract(marketAbi, this.marketAddress);
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

  async getMetadata(drinkId: string): Promise<Metadata> {
    const contract = this.getMarketContract();
    const [price, lastPurchase] = await Promise.all([
      contract.methods.getPrice(drinkId).call(),
      contract.methods.getLastPurchase(drinkId).call(),
    ]);

    return {
      price: price.toString(),
      displayPrice: fromWei(price.toString(), 'ether'),
      lastPurchase: new Date(lastPurchase.toNumber() * 1000),
    }
  }

  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
