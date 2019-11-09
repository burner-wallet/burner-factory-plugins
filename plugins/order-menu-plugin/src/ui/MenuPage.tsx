import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';

const MenuPage: React.FC<PluginPageContext> = ({ burnerComponents }) => {
  const { Page } = burnerComponents;

  return (
    <Page title="Menu">
      Test
    </Page>
  );
};

export default MenuPage;
