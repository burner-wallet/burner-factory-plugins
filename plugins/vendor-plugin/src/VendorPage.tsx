import React, { useState, useEffect, ComponentType } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import VendorPlugin from './VendorPlugin';
import OrderPage from './OrderPage';
import MenuPage from './MenuPage';

const Content = styled.div`
  flex: 1;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div`
  display: flex;
`;

const SubHeading = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  background: #f3f1f1;
  padding: 4px;
  align-items: center;
`;

const HeaderSettings = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  font-size: 14px;
`;

export const StyledNavLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  flex: 1 0 10%;
  text-align: center;
  background: #ececec;
  line-height: 40px;

  &:hover {
    background: #efefef;
  }

  &.active {
    background: #cecece;
  }
`;

const VendorPage: React.FC<PluginPageContext & { className: string }> = ({
  BurnerComponents, plugin, defaultAccount, assets, actions, className
}) => {
  const _plugin = plugin as VendorPlugin;

  const [menu, setMenu] = useState<any>(null);
  
  const refresh = async () => {
    const _menu = await _plugin.getMenu(true);
    setMenu(_menu);
  };

  useEffect(() => {
    _plugin.getMenu().then((_menu: any) => setMenu(_menu));
  }, []);

  const { Page, History, Button } = BurnerComponents;
  if (!menu) {
    return (
      // @ts-ignore
      <Page title="Vendor" className={className}>Loading...</Page>
    );
  }

  const [vendor] = menu.vendors.filter((vendor: any) => vendor.recipient === defaultAccount);
  if (!vendor) {
    return (
      // @ts-ignore
      <Page title="Vendor" className={className}>Your account is not associated with any vendor</Page>
    );
  }
  const vendorIndex = menu.vendors.indexOf(vendor);

  const setOpen = async (isOpen: boolean) => {
    await _plugin.setIsOpen(vendorIndex, isOpen);
    refresh();
  }

  return (
    // @ts-ignore
    <Page title="Vendor" className={className}>
      <Content>
        <SubHeading>
          <div>{vendor.name}</div>
          <HeaderSettings>
            <label>
              Is open
              <input
                type="checkbox"
                checked={vendor.isOpen === false ? false : true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpen(e.target.checked)}
              />
            </label>
          </HeaderSettings>
        </SubHeading>
        <Switch>
          <Route path="/vendor/orders" render={() => (<OrderPage plugin={_plugin} />)} />
          <Route
            path="/vendor/menu"
            render={() =>(<MenuPage vendor={vendor} plugin={_plugin} vendorIndex={vendorIndex} refresh={refresh} />)}
          />
          <Redirect to="/vendor/orders" />
        </Switch>
      </Content>
      <Bottom>
        <StyledNavLink to="/vendor/orders">Orders</StyledNavLink>
        <StyledNavLink to="/vendor/menu">Menu</StyledNavLink>
      </Bottom>
    </Page>
  );
};

const StyledVendorPage = styled(VendorPage)`
  position: absolute;
  top: 60px;
  left: 10px;
  right: 10px;
  bottom: 10px;
`;

export default StyledVendorPage as unknown as ComponentType<PluginPageContext>;
