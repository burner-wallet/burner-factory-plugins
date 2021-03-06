import React, { Fragment, useEffect, useState } from 'react';
import { PluginPageContext, AccountBalanceData, Asset } from '@burner-wallet/types';
import { Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import OrderMenuPlugin from '../OrderMenuPlugin';
import { Menu, Selection, Vendor } from '../menuType';
import CheckoutBar from './CheckoutBar';
import OrderForm from './OrderForm';
import Vendors from './Vendors';

const Balance = styled.div`
  color: #777777;
  margin: 8px 0;
`;

interface MenuPageParams {
  vendorName: string;
}

const MenuPage: React.FC<PluginPageContext<MenuPageParams>> = ({ BurnerComponents, plugin, assets, match, actions }) => {
  const _plugin = plugin as OrderMenuPlugin;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [selection, setSelection] = useState<Selection>({});

  useEffect(() => {
    _plugin.getMenu().then((_menu: Menu) => setMenu(_menu));
  }, []);

  useEffect(() => {
    setSelection({});
  }, [match.params]);

  const { Page, AccountBalance } = BurnerComponents;
  if (!menu) {
    return (
      <Page title="Menu">
        Loading...
      </Page>
    );
  }

  const [asset] = assets.filter((_asset: Asset) => _asset.id === menu.asset);
  if (!asset) {
    return (
      <div>Error: asset {menu.asset} not found</div>
    );
  }

  if (!_plugin.name) {
    return <Redirect to="/menu/set-name" />
  }

  if (!match.params.vendorName) {
    return <Redirect to={`/menu/${menu.vendors[0].id}`} />
  }

  const [vendor] = match.params.vendorName
    ? menu.vendors.filter((_vendor: Vendor) => _vendor.id == match.params.vendorName)
    : [] as Vendor[];

  const send = (total: string, message: string) => actions.send({
    ether: total,
    asset: asset.id,
    message: `[${_plugin.name}]: ${message}`,
    to: vendor.recipient,
  });

  return (
    <Page title="Menu">
      <AccountBalance
        asset={menu.asset}
        render={(balance: AccountBalanceData | null) => (
          <Fragment>
            {menu.vendors.length > 1 && (
              <Vendors vendors={menu.vendors} />
            )}
            <Balance>
              Name: {_plugin.name} <Link to="/menu/set-name">Edit</Link>
            </Balance>
            {balance && (
              <Balance>Available balance: {balance.displayMaximumSendableBalance} {asset.name}</Balance>
            )}
            {vendor && (
              <OrderForm
                items={vendor.items}
                onChange={(newSelection: Selection) => setSelection(newSelection)}
                selection={selection}
                asset={asset}
              />
            )}
            {Object.values(selection).reduce((a: number, b: number) => a + b, 0) > 0 && (
              <CheckoutBar
                selection={selection}
                items={vendor.items}
                asset={asset}
                onSend={send}
                balance={balance && balance.displayMaximumSendableBalance}
              />
            )}
          </Fragment>
        )}
      />
    </Page>
  );
};

export default MenuPage;
