import React from 'react';
import StockMarketMenuPlugin, { Drink } from '../StockMarketMenuPlugin';
import styled from 'styled-components';

const Item = styled.div<{ selected: boolean }>`
  display: flex;
  border: solid 2px #999999;
  padding: 8px;
  padding: 14px;
  font-size: 24px;
  ${props => props.selected ? 'border-color: #FF9999' : ''}
`;

interface DrinkItemProps {
  drink: Drink;
  plugin: StockMarketMenuPlugin;
  onClick: () => void;
  selected: boolean;
}

const DrinkItem: React.FC<DrinkItemProps> = ({ drink, onClick, selected }) => {
  return (
    <Item onClick={onClick} selected={selected}>
      {drink.name}
    </Item>
  );
};

export default DrinkItem;
