import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth, NativeAsset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import CollectablePlugin from '@burner-factory/collectable-plugin';
import OrderMenuPlugin from '@burner-factory/order-menu-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import ENSPlugin from '@burner-wallet/ens-plugin';
import waterloo from './waterloo.json';

const keth = new NativeAsset({
  id: 'keth',
  name: 'kETH',
  network: '42',
  // id: 'geth',
  // name: 'gETH',
  // network: '5',
});

const core = new BurnerCore({
  // @ts-ignore
  signers: [
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!, { useLocalStorage: false }),
    new InjectedSigner(),
    new LocalSigner(),
  ],
  gateways: [
    // new InjectedGateway(),
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [keth, xdai, dai, eth],
});


const BurnerWallet = () =>
  <ModernUI
    // @ts-ignore
    core={core}
    plugins={[
      new ContractWalletPlugin(),
      new BurnableENSPlugin({
        domain: 'myburner.test',
        tokenAddress: '0xc03bbef8b85a19ABEace435431faED98c31852d9',
        network: '5',
      }),
      new ENSPlugin('5'),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!, 'http://localhost:3000'),
      new CollectablePlugin('100', '0xdc6Bc87DD19a4e6877dCEb358d77CBe76e226B8b'),
      new OrderMenuPlugin(''),
      new SchedulePlugin(waterloo),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
