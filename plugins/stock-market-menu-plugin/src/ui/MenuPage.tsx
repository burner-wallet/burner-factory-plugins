import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { toBN } from 'web3-utils';
import StockMarketMenuPlugin, { Drink, Metadata } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin, defaultAccount }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selected, setSelected] = useState<Drink | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<Metadata | null>(null);

  const refreshSelectedMeta = async () => {
    if (selected) {
      const metadata = await _plugin.getMetadata(selected.id, defaultAccount);
      setSelectedMeta(metadata);
    }
  };

  useEffect(() => {
    _plugin.getDrinks().then((drinks: Drink[]) => setDrinks(drinks));
  }, []);

  useEffect(() => {
    if (selected && !selectedMeta) {
      refreshSelectedMeta();
    }
  }, [selected, selectedMeta]);

  const buy = async () => {
    await _plugin.buy(defaultAccount, selected!.id);
    setSelected(null);
    setSelectedMeta(null);
  };

  const { Page, Button, AccountBalance } = burnerComponents;
  return (
    <Page title="Menu">
      {drinks.map((drink: Drink) => (
        <DrinkItem
          drink={drink}
          key={drink.id}
          plugin={_plugin}
          selected={!!(selected && drink.id === selected.id)}
          sender={defaultAccount}
          onClick={async () => {
            setSelected(drink);
            setSelectedMeta(null);
          }}
        />
      ))}
      {selected && (
        <div>
          <Button disabled={!selectedMeta || selectedMeta.insufficent} onClick={buy}>
            Purchase {selectedMeta ? `(${selectedMeta.displayPrice})` : ''}
          </Button>
          {selectedMeta && selectedMeta.insufficent && (<div>Insufficent balance</div>)}
        </div>
      )}
    </Page>
  );
};

export default MenuPage;
