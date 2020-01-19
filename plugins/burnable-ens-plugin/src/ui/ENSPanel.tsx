import React, { useState, useEffect } from 'react';
import { PluginElementContext } from '@burner-wallet/types';
import styled from 'styled-components';
import BurnableENSPlugin from '../BurnableENSPlugin';
import NameBadge from './NameBadge';
import NameForm from './NameForm';

const Container = styled.div`
  margin: 4px 0;
  background: #EEEEEE;
  border-radius: 8px;
  padding: 4px;
`;
const Title = styled.div`
  color: #BBBBBB;
  font-size: 12px;
`;
const Bar = styled.div`
  margin-top: 4px;
  display: flex;
`;

const ENSPanel: React.FC<PluginElementContext> = ({ defaultAccount, plugin }) => {
  const [name, setName] = useState<string | null>(null);
  const _plugin = plugin as BurnableENSPlugin;

  const refresh = () => _plugin.getName(defaultAccount).then((name: string | null) => setName(name));

  useEffect(() => { refresh() }, [defaultAccount]);

  return (
    <Container>
      <Title>Burnable ENS Names (Ethereum Name Service)</Title>
      <Bar>
        {name ? (
          <NameBadge account={defaultAccount} plugin={_plugin} name={name} refresh={refresh} />
        ) : (
          <NameForm account={defaultAccount} plugin={_plugin} refresh={refresh} />
        )}
      </Bar>
    </Container>
  );
};

export default ENSPanel;
