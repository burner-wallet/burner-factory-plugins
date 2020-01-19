import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import BurnableENSPlugin from '../BurnableENSPlugin';

const InputContainer = styled.div`
  background: #FFFFFF;
  flex: 1;
  display: flex;
  border-radius: 4px;
  align-items: center;
`;

const Input = styled.input`
  border: 0;
  flex: 1;
  width: 0;
  outline: none;
  background: transparent;
  text-align: right;
  font-size: 18px;
  padding: 4px 0;
`;

const Domain = styled.div`
  font-size: 18px;
  padding-right: 4px;
`;

const RegisterButton = styled.button``;

interface NameFormProps  {
  account: string;
  plugin: BurnableENSPlugin;
  refresh: () => void;
}

const NameForm: React.FC<NameFormProps> = ({ account, plugin, refresh }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
    await plugin.register(newName, account);
    await refresh();
    setLoading(false);
  };

  return (
    <Fragment>
      <InputContainer>
        <Input
          value={newName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          disabled={loading}
        />
        <Domain>.{plugin.domain}</Domain>
      </InputContainer>

      <RegisterButton onClick={register} disabled={loading}>Register</RegisterButton>
    </Fragment>
  );
};

export default NameForm;
