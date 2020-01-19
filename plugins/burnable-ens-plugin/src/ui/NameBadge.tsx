import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import BurnableENSPlugin from '../BurnableENSPlugin';

const Name = styled.div`
  flex: 1;
  font-size: 18px;
`;
const BurnButton = styled.button`
`;

interface NameFormProps  {
  account: string;
  name: string;
  plugin: BurnableENSPlugin;
  refresh: () => void;
}

const ENSPanel: React.FC<NameFormProps> = ({ account, name, plugin, refresh }) => {
  const [loading, setLoading] = useState(false);

  const burn = async () => {
    setLoading(true);
    await plugin.burn(account);
    await refresh();
    setLoading(false);
  };

  return (
    <Fragment>
      <Name>{name}</Name>
      <BurnButton onClick={burn} disabled={loading}>Burn</BurnButton>
    </Fragment>
  );
};

export default ENSPanel;
