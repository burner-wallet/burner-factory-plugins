import React, { useState, useEffect, Fragment } from 'react';
import StockMarketMenuPlugin, { Drink, Metadata } from '../StockMarketMenuPlugin';
import styled from 'styled-components';

const Item = styled.div<{ selected: boolean }>`
  display: flex;
  border: solid 2px #999999;
  padding: 8px;
  padding: 14px;
  font-size: 24px;
  justify-content: space-between;
  ${props => props.selected ? 'border-color: #FF9999' : ''}
`;

interface DrinkItemProps {
  drink: Drink;
  plugin: StockMarketMenuPlugin;
  onClick: () => void;
  selected: boolean;
  sender: string;
}

const RISING_TIME = 30 * 1000;

const DrinkItem: React.FC<DrinkItemProps> = ({ drink, onClick, selected, plugin, sender }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const metadata = await plugin.getMetadata(drink.id, sender);
      setMetadata(metadata);
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  const goingUp = !!metadata && (Date.now() - metadata.lastPurchase.getTime()) < RISING_TIME;
  return (
    <Item onClick={onClick} selected={selected}>
      <div>{drink.name}</div>
      {metadata && (
        <Fragment>
          <div>{goingUp ? 'Up' : 'Down'}</div>
          <div>{metadata.displayPrice}</div>
        </Fragment>
      )}
    </Item>
  );
};

export default DrinkItem;
