import { Plugin, BurnerPluginContext, Account } from '@burner-wallet/types';
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
  private drinks: Drink[];

  constructor(marketAddress: string, network: string = '100') {
    this.marketAddress = marketAddress;
    this.network = network;
    this.drinks = [];
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

  async getDrinks() {
    if (!this.drinks) {
      const events = await this.getMarketContract().getPastEvents('AddDrink');
      console.log(events);
      this.drinks = [];
    }
    return this.drinks;
  }

  async vendorSearch(query: string): Promise<Account[]> {
    return []; //TODO
  }
}
