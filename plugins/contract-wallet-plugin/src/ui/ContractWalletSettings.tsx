import React, { useState } from 'react';
import { PluginElementContext } from '@burner-wallet/types';

const ContractWalletSettings: React.FC<PluginElementContext> = ({ BurnerComponents, actions }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggle = async () => {
    await actions.callSigner(isEnabled ? 'disable' : 'enable', 'contract');
    setIsEnabled(!isEnabled);
  };

  const { Button } = BurnerComponents;
  return (
    <div>
      <h2>Contract Wallet</h2>
      <p>
        This wallet is using counterfactual contract wallets, which allows Gas Station Network {}
        integration, multiple transaction signers, metatransactions, and more!
      </p>

      <div>
        <Button onClick={toggle}>Contract wallets are {isEnabled ? 'enabled' : 'disabled'}</Button>
      </div>
    </div>
  );
};

export default ContractWalletSettings;
