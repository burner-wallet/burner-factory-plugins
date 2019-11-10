import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { toBN } from 'web3-utils';
import StockMarketMenuPlugin, { Order } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin, defaultAccount, actions }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = async () => {
    const orders = await _plugin.getOrders(defaultAccount);
    setOrders(orders);
  };

  useEffect(() => {
    refresh();
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
          {_plugin.adminMode && (
            <div>
              <input type="checkbox" checked={order.completed} onChange={e => {
                _plugin.setCompleted(order.tx, e.target.checked);
                refresh();
              }} />
            </div>
          )}
        </div>
      ))}
    </Page>
  );
};

export default MenuPage;
