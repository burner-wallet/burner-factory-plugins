import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { toBN } from 'web3-utils';
import StockMarketMenuPlugin, { Order } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin, defaultAccount, actions }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    _plugin.getOrders(defaultAccount).then((orders: Order[]) => setOrders(orders));
  }, [defaultAccount]);

  const { Page, Button } = burnerComponents;
  return (
    <Page title="Recent Orders">
      <Button onClick={() => actions.navigateTo('/stock-market')}>Back</Button>

      {orders.map((order: Order) => (
        <div key={order.tx}>
          <div>{order.name}</div>
          <div>{order.displayPrice}</div>
          <div>From: {order.buyer}</div>
        </div>
      ))}
    </Page>
  );
};

export default MenuPage;
