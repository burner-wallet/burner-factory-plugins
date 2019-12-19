import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import ContractWalletSettings from './ui/ContractWalletSettings';

export default class OrderMenuPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('advanced', ContractWalletSettings);
  }
}
