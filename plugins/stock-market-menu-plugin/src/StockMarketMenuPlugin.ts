import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
import { toUtf8 } from 'web3-utils';
import MenuPage from './ui/MenuPage';
import marketAbi from './abi/Market.json';

export interface Drink {
  id: string;
  name: string;
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

  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
