import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { HTTPGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import CollectablePlugin from '@burner-factory/collectable-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import StockMarketMenuPlugin from '@burner-factory/stock-market-menu-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import OrderMenuPlugin from '@burner-factory/order-menu-plugin';

const core = new BurnerCore({
  signers: [
    new ContractWalletSigner('0x2350aDCee6C162B05580C4fc1603c4d410C960d3'),
    new InjectedSigner(),
    new LocalSigner({ privateKey: process.env.REACT_APP_PK, saveKey: false }),
  ],
  gateways: [
    new HTTPGateway('http://localhost:8545', '5777'),
  ],
  assets: [
    new ERC20Asset({
      id: 'localerc20',
      name: 'Local Token',
      network: '5777',
      address: process.env.REACT_APP_ERC20_ADDRESS!,
    }),
    new NativeAsset({
      id: 'geth',
      name: 'Ganache ETH',
      network: '5777',
    }),
  ],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHWaterloo"
    core={core}
    plugins={[
      new CollectablePlugin('100', '0xdc6Bc87DD19a4e6877dCEb358d77CBe76e226B8b'),
      new OrderMenuPlugin('aaaaaaaaaaaaaaaaa', 'localerc20', { factory: 'http://localhost:3000' }),
      // new StockMarketMenuPlugin('0x13adFb029888cf676351C5b878F9B7B87891298A', 'localerc777', '5777', true),
      // new SchedulePlugin(),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
