# Token Exchange Pairs (`@burner-factory/token-exchange-pairs`)

Exchange pairs for the Exchange plugin (`@burner-wallet/exchange`). Allows backed tokens created by
the Burner Factory to be exchanged to and from the native asset.

## Example

```JSX
import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { XDaiGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import Exchange from '@burner-wallet/exchange';
import { BackedTokenPair } from '@burner-factory/token-exchange-pairs';

const token = new ERC777Asset({
  id: 'vend',
  name: 'Test Vendable',
  network: '100',
  address: '0xCcDc8B0A05edB13170706A5621Cb60cC8c4C363D',
});

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [new XDaiGateway()],
  assets: [xdai, token],
});

const exchange = new Exchange({
  pairs: [new BackedTokenPair('vend', 'xdai')],
});

const BurnerWallet = () =>
  <ModernUI core={core} plugins={[exchange]} />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
```
