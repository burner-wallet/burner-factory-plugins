import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { HTTPGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import CollectablePlugin from '@burner-factory/collectable-plugin';
import StockMarketMenuPlugin from '@burner-factory/stock-market-menu-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';

const core = new BurnerCore({
  signers: [
    new InjectedSigner(),
    new LocalSigner({ privateKey: process.env.REACT_APP_PK, saveKey: false }),
  ],
  gateways: [
    new HTTPGateway('http://localhost:8545', '5777'),
  ],
  assets: [
    new ERC777Asset({
      id: 'localerc777',
      name: 'Waterloonies',
      network: '5777',
      address: '0x8d3afbb824AD2205016bd8c1c8D5a3B3DC38d427',
    }),
    new ERC20Asset({
      id: 'localerc20',
      name: 'Local Token',
      network: '5777',
      // @ts-ignore
      address: process.env.REACT_APP_ERC20_ADDRESS,
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
      new StockMarketMenuPlugin('0xdE15073c8BaEe09DcbD7e254d99c87d883642b56', 'localerc777', '5777'),
      new SchedulePlugin(),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
