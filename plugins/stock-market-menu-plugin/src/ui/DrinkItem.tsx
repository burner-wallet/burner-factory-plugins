import React, { useState, useEffect, Fragment, useRef } from 'react';
import StockMarketMenuPlugin, { Drink, Metadata } from '../StockMarketMenuPlugin';
import styled from 'styled-components';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Item = styled.div<{ selected: boolean }>`
  display: flex;
  border: solid 2px #999999;
  padding: 8px;
  padding: 14px;
  font-size: 24px;
  justify-content: space-between;
  height: 40px;
  ${props => props.selected ? 'border-color: #FF9999' : ''}
`;

const LinesContainer = styled.div`
  flex: 1;
  margin: 0 20px;

  & svg {
    height: 40px;
  }
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
  const priceFeed = useRef<number[]>(plugin.historicPrices[drink.id] || []);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const metadata = await plugin.getMetadata(drink.id, sender);
      setMetadata(metadata);
      priceFeed.current = [...priceFeed.current, parseFloat(metadata.displayPrice)].slice(-10);
    }, 5000);
    return () => {
      window.clearInterval(interval);
      plugin.historicPrices[drink.id] = priceFeed.current;
    };
  }, []);

  const goingUp = !!metadata && (Date.now() - metadata.lastPurchase.getTime()) < RISING_TIME;
  return (
    <Item onClick={onClick} selected={selected}>
      <div>{drink.name}</div>
      <LinesContainer>
        <Sparklines data={priceFeed.current} height={40}>
          <SparklinesLine color="blue" />
        </Sparklines>
      </LinesContainer>
      {metadata && (
        <div style={{ color: goingUp ? 'green' : 'red' }}>
          {goingUp ? '\u2192' : '\u2193'} {parseFloat(metadata.displayPrice).toFixed(2)}
        </div>
      )}
    </Item>
  );
};

export default DrinkItem;
