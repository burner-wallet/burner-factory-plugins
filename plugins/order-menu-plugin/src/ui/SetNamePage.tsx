import React, { useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import OrderMenuPlugin from '../OrderMenuPlugin';

const NameInput = styled.input`
  width: 100%;
  display: block;
  font-size: 24px;
`;

const SetNamePage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, actions }) => {
  const _plugin = plugin as OrderMenuPlugin;
  const [name, setName] = useState(_plugin.name || '');

  return (
    <BurnerComponents.Page title="Set your name">
      <p>Set your name so we know which order is yours!</p>

      <NameInput value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

      <BurnerComponents.Button onClick={() => {
        _plugin.setName(name);
        actions.navigateTo('/menu');
      }}>
        Set Name
      </BurnerComponents.Button>
    </BurnerComponents.Page>
  );
};

export default SetNamePage;
