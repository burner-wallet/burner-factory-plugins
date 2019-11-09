import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import StockMarketMenuPlugin, { Drink } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [drinks, setDrinks] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    _plugin.getDrinks();
  }, []);

  const { Page, Button } = burnerComponents;
  return (
    <Page title="Menu">
      {drinks.map((drink: Drink) => {
        <DrinkItem drink={drink} key={drink.id} />
      })}
      <Button>Send</Button>
    </Page>
  );
};

export default MenuPage;
