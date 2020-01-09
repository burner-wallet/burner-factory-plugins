import React, { useState, useEffect, Fragment } from 'react';
import { PluginElementContext } from '@burner-wallet/types';

const ContractWalletSettings: React.FC<PluginElementContext> = ({
  BurnerComponents, actions, accounts
}) => {
  const [_updateVal, _update] = useState(false);
  const [isEnabled, setIsEnabled] = useState(actions.callSigner('isEnabled', 'contract') as unknown as boolean);
  const [selected, setSelected] = useState(0);
  const [overrideAccount, setOverrideAccount] = useState(accounts[accounts.length - 1]);

  const update = () => _update(!_updateVal);

  const contractAccounts = accounts.filter((account: string) => actions.canCallSigner('isContractWallet', account));

  const toggle = async () => {
    await actions.callSigner(isEnabled ? 'disable' : 'enable', 'contract');
    setIsEnabled(!isEnabled);
  };

  const addSigner = async () => {
    await actions.callSigner('setSignerOverride', contractAccounts[selected], overrideAccount);
    update();
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

      {isEnabled && (
        <Fragment>
          <div>Contract wallets:</div>
          <ul>
            {contractAccounts.map((account: string, i: number) => (
              <li
                key={account}
                style={{ background: selected === i ? '#EEEEFF' : undefined }}
                onClick={() => setSelected(i)}
              >
                <div style={{ fontWeight: 'bold' }}>{account}</div>
                <div>Owner: {actions.callSigner('getOwner', account)}</div>
                {actions.callSigner('getSignerOverride', account) && (
                  <div>Override: {actions.callSigner('getSignerOverride', account)}</div>
                )}
              </li>
            ))}
          </ul>

          <div>
            Set Override Signer
            <select onChange={(e: any) => setOverrideAccount(e.target.value)} value={overrideAccount}>
              {accounts.filter((account: string) => contractAccounts.indexOf(account) === -1).map((account: string) => (
                <option key={account} value={account}>{account}</option>
              ))}
            </select>
            <Button onClick={addSigner}>Set Override</Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ContractWalletSettings;
