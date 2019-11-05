import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import CollectablePlugin from '@burner-factory/collectable-plugin';

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [xdai, dai, eth],
});


const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[
      new PushNotificationPlugin(),
      new CollectablePlugin('100', '0xdc6Bc87DD19a4e6877dCEb358d77CBe76e226B8b'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
