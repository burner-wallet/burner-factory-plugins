import React, { useState, useEffect } from 'react';
import { PluginElementContext } from '@burner-wallet/types';

const ContractWalletSettings: React.FC<PluginElementContext> = ({
  BurnerComponents, actions, accounts, defaultAccount
}) => {
  const [isEnabled, setIsEnabled] = useState(actions.callSigner('isEnabled', 'contract') as unknown as boolean);
  const [selectedAccount, setSelectedAccount] = useState(accounts[accounts.length - 1]);

  const toggle = async () => {
    await actions.callSigner(isEnabled ? 'disable' : 'enable', 'contract');
    setIsEnabled(!isEnabled);
  };
  const addSigner = async () => {
    await actions.callSigner('setSignerOverride', defaultAccount, selectedAccount);
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

      <div>
        Add Signer
        <select onChange={(e: any) => setSelectedAccount(e.target.value)} value={selectedAccount}>
          {accounts.filter((account: string) => account !== defaultAccount).map((account: string) => (
            <option key={account} value={account}>{account}</option>
          ))}
        </select>
        <Button onClick={addSigner}>Add Signer</Button>
      </div>
    </div>
  );
};

export default ContractWalletSettings;
