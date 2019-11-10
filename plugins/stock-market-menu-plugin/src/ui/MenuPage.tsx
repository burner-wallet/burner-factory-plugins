import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { toBN } from 'web3-utils';
import StockMarketMenuPlugin, { Drink, Metadata, Order } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin, defaultAccount, actions }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selected, setSelected] = useState<Drink | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<Metadata | null>(null);
  const [numOrders, setNumOrders] = useState(0);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(_plugin.name);

  const refreshSelectedMeta = async () => {
    if (selected) {
      const metadata = await _plugin.getMetadata(selected.id, defaultAccount);
      setSelectedMeta(metadata);
    }
  };

  useEffect(() => {
    _plugin.getDrinks().then((drinks: Drink[]) => setDrinks(drinks));
    _plugin.getOrders(defaultAccount).then((orders: Order[]) => setNumOrders(orders.length));
  }, []);

  useEffect(() => {
    if (selected && !selectedMeta) {
      refreshSelectedMeta();
    }
  }, [selected, selectedMeta]);

  const buy = async () => {
    await _plugin.buy(defaultAccount, selected!.id);
    actions.navigateTo('/stock-market/orders')
  };

  const nameLinkClick = editing ? () => {
    _plugin.setName(newName);
    setEditing(false);
  } : () => setEditing(true);

  const { Page, Button, AccountBalance } = burnerComponents;
  return (
    <Page title="Menu">
      {numOrders > 0 && (
        <Button onClick={() => actions.navigateTo('/stock-market/orders')}>My Orders ({numOrders})</Button>
      )}

      <div style={{ margin: '4px'}}>
        Your Name:
        {editing ? (
          <input value={newName} onChange={(e: any) => setNewName(e.target.value)} />
        ) : _plugin.name}
        <a href="#" onClick={nameLinkClick}>{editing ? 'Save' : 'Edit'}</a>
      </div>

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
