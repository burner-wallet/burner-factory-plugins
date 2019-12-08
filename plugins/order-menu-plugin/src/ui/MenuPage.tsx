import React, { Fragment, useEffect, useState } from 'react';
import { PluginPageContext, AccountBalanceData, Asset } from '@burner-wallet/types';
import { Redirect } from 'react-router-dom';

import OrderMenuPlugin from '../OrderMenuPlugin';
import { Menu, Selection, Vendor } from '../menuType';
import CheckoutBar from './CheckoutBar';
import OrderForm from './OrderForm';
import Vendors from './Vendors';

interface MenuPageParams {
  vendorName: string;
}

const MenuPage: React.FC<PluginPageContext<MenuPageParams>> = ({ BurnerComponents, plugin, assets, match }) => {
  const _plugin = plugin as OrderMenuPlugin;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [selection, setSelection] = useState<Selection>({});
  const [asset] = assets.filter((_asset: Asset) => _asset.id === _plugin.asset);

  useEffect(() => {
    _plugin.getMenu().then((_menu: Menu) => setMenu(_menu));
  }, []);

  const { Page, AccountBalance } = BurnerComponents;
  if (!menu) {
    return (
      <Page title="Menu">
        Loading...
      </Page>
    );
  }

  if (menu.vendors.length === 1 && !match.params.vendorName) {
    return <Redirect to={`/menu/${menu.vendors[0].id}`} />
  }

  const [vendor] = match.params.vendorName
    ? menu.vendors.filter((_vendor: Vendor) => _vendor.id == match.params.vendorName)
    : [] as Vendor[];

  return (
    <Page title="Menu">
      <AccountBalance
        asset={_plugin.asset}
        render={(data: AccountBalanceData | null) => (
          <Fragment>
            {menu.vendors.length > 1 && (
              <Vendors vendors={menu.vendors} />
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
              <CheckoutBar selection={selection} />
            )}
          </Fragment>
        )}
      />
    </Page>
  );
};

export default MenuPage;
