import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { Selection } from '../menuType';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 51;
`;

const PanelContainer = styled.div<{ open: boolean }>`
  position: absolute;
  bottom: 0;
  max-height: ${props => props.open ? '50%' : '0'};
  transition: all 1s;
  left: 0;
  right: 0;
`;
const Panel = styled.div`
  max-width: 670px;
  background: gray;
  margin: 0 auto;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: red;
  max-width: 670px;
  height: 40px;
  display: block;
  margin: 0 auto;
  outline: none;
  border: 0;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
`;

interface CheckoutBarProps {
  selection: Selection;
}

const CheckoutBar: React.FC<CheckoutBarProps> = ({ selection }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <Container>
        <CheckoutButton onClick={() => setIsOpen(!isOpen)}>Checkout</CheckoutButton>
        <PanelContainer open={isOpen}>
          <Panel>
            Test
          </Panel>
        </PanelContainer>
      </Container>
      {isOpen && <Background onClick={() => setIsOpen(false)} />}
    </Fragment>
  );
};

export default CheckoutBar;

