import React from 'react';
import { Asset } from '@burner-wallet/types';
import { Item, Selection } from '../menuType';
import ItemRow from './ItemRow';

interface OrderFormProps {
  items: Item[];
  asset: Asset,
  selection: Selection;
  onChange: (newSelection: Selection) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ items, selection, onChange, asset }) => {
  return (
    <div>
      {items.map((item: Item, i: number) => (
        <ItemRow
          item={item}
          quantity={selection[i] || 0}
          key={item.name}
          onChange={(quantity: number) => onChange({ ...selection, [i]: quantity })}
          asset={asset}
        />
      ))}
    </div>
  );
};

export default OrderForm;
