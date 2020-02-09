import React, { useEffect, useState } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import styled from 'styled-components';
import VendorPlugin from './VendorPlugin';

const ItemRow = styled.div`
  display: flex;
`;

const AvailableColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemName = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

interface MenuPageProps {
  vendor: any;
  vendorIndex: number;
  plugin: VendorPlugin;
  refresh: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ vendor, vendorIndex, plugin, refresh }) => {
  const { BurnerComponents } = useBurner();
  const { Page } = BurnerComponents;

  const setAvailable = async (itemIndex: number, isAvailable: boolean) => {
    await plugin.setAvailable(vendorIndex, itemIndex, isAvailable);
    refresh();
  }

  return (
    <div>
      {vendor.items.map((item: any, i: number) => (
        <ItemRow key={item.name}>
          <ItemName>{item.name} - {item.price}</ItemName>

          <AvailableColumn>
            <input
              type="checkbox"
              checked={item.available}
              id={`item_${i}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailable(i, e.target.checked)}
            />
            <label htmlFor={`item_${i}`}>In Stock</label>
          </AvailableColumn>
        </ItemRow>
      ))}
    </div>
  );
};

export default MenuPage;
