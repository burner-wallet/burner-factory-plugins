import React from 'react';
import { Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import { Item } from '../menuType';
import Stepper from './Stepper';

const Row = styled.div<{ active: boolean }>`
  display: flex;
  color: ${props => props.active ? '#333333' : '#999999'};
  border: solid 2px ${props => props.active ? '#333333' : '#999999'};
  align-items: center;
  margin: -1px 0;
`;

const ItemName = styled.div`
  font-weight: bold;
`;

const Price = styled.div`
  color: #555555;
`;

const ItemInfo = styled.div`
  flex: 1;
  padding: 8px;
`;

interface ItemRow {
  item: Item,
  quantity: number;
  onChange: (quanity: number) => void;
  asset: Asset,
}

const ItemRow: React.FC<ItemRow> = ({ item, quantity, onChange, asset }) => {
  return (
    <Row active={quantity > 0}>
      <ItemInfo onClick={quantity === 0 ? () => onChange(1) : undefined}>
        <ItemName>{item.name}</ItemName>
        <Price>{item.price} {asset.name}</Price>
      </ItemInfo>

      <Stepper value={quantity} onChange={onChange} />
    </Row>
  );
}


export default ItemRow;
