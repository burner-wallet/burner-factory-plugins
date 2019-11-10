import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { toBN } from 'web3-utils';
import styled from 'styled-components';
import StockMarketMenuPlugin, { Order } from '../StockMarketMenuPlugin';
import DrinkItem from './DrinkItem';

const Order = styled.div<{ completed: boolean }>`
  display: flex;
  height: 50px;
  align-items: center;
  border-bottom: solid 1px #999999;
  ${props => props.completed ? 'color: #cccccc' : ''}
`;

const Left = styled.div`
  flex: 1;
`;

const Price = styled.div`
  font-size: 24px;
`;

const Checkbox = styled.input`
  transform: scale(1.5);
  margin: 8px;
`;

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents, plugin, defaultAccount, actions }) => {
  const _plugin = plugin as StockMarketMenuPlugin;
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = async () => {
    const orders = await _plugin.getOrders(defaultAccount);
    setOrders(orders);
  };

  useEffect(() => {
    refresh();
    const timeout = window.setInterval(refresh, 10 * 1000);
    return () => window.clearTimeout(timeout);
  }, [defaultAccount]);

  const { Page, Button } = burnerComponents;
  return (
    <Page title="Recent Orders">
      <Button onClick={() => actions.navigateTo('/stock-market')}>Back</Button>

      {orders.map((order: Order) => (
        <Order key={order.tx} completed={order.completed}>
          <Left>
            <div>{order.name}</div>
            <div>From: {order.buyer}</div>
          </Left>
          <Price>{order.displayPrice}</Price>
          {_plugin.adminMode && (
            <div>
              <Checkbox type="checkbox" checked={order.completed} onChange={e => {
                _plugin.setCompleted(order.tx, e.target.checked);
                refresh();
              }} />
            </div>
          )}
        </Order>
      ))}
    </Page>
  );
};

export default MenuPage;
