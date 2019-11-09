import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import StockMarketMenuPlugin, { Drink } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selected, setSelected] = useState<Drink | null>(null);

  useEffect(() => {
    _plugin.getDrinks().then((drinks: Drink[]) => setDrinks(drinks));
  }, []);

  const { Page, Button } = burnerComponents;
  return (
    <Page title="Menu">
      {drinks.map((drink: Drink) => (
        <DrinkItem
          drink={drink}
          key={drink.id}
          plugin={_plugin}
          selected={!!(selected && drink.id === selected.id)}
          onClick={() => setSelected(drink)}
        />
      ))}
      <Button>Send</Button>
    </Page>
  );
};

export default MenuPage;
