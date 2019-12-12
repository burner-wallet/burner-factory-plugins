import React, { useState, useRef, Fragment, ChangeEvent } from 'react';
import styled from 'styled-components';
import { Asset } from '@burner-wallet/types';
import { Item, Selection } from '../menuType';
import Stepper from './Stepper';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 51;
`;

const PanelContainer = styled.div`
  position: absolute;
  bottom: 0;
  height: 0;
  transition: all 0.5s;
  left: 0;
  right: 0;
`;
const Panel = styled.div`
  max-width: 670px;
  background: #e0e0e0;
  margin: 0 auto;
  padding: 16px;
  font-size: 18px;
`;

const StartCheckoutButton = styled.button`
  width: 100%;
  background: red;
  max-width: 670px;
  height: 40px;
  display: block;
  margin: 0 auto;
  outline: none;
  border: 0;
  font-size: 18px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
`;

const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: solid 1px #aaaaaa;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
`;
const Label = styled.div`
  margin-right: 10px;
`;
const Notes = styled.textarea`
  flex: 1;
  font-size: 18px;
`;

const CheckoutButton = styled.button`
  height: 30px;
  border-radius: 100px;
  display: block;
  width: 100%;
  background: #ededed;
  font-size: 18px;
  border: 0;
`;

interface CheckoutBarProps {
  selection: Selection;
  items: Item[];
  asset: Asset;
  onSend: (total: string, message: string) => void;
  balance: string | null;
}

interface ItemWithSelection extends Item {
  quantity: number;
  cost: number;
}

const createMessage = (items: ItemWithSelection[], tip: number, note: string) => {
  let message = items
    .map((item) => `${item.name}: ${item.quantity}`)
    .join(', ');
  if (tip != 0) {
    message += `, Tip: ${tip}`
  }
  if (note.length > 0) {
    message += `, "${note}"`;
  }

  return message;
};

const CheckoutBar: React.FC<CheckoutBarProps> = ({ selection, items, asset, onSend, balance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState(0);
  const [note, setNote] = useState('');
  const panel = useRef<HTMLDivElement | null>(null);

  const itemsWithSelection = items.map((item: Item, i: number) => ({
    ...item,
    quantity: selection[i],
    cost: selection[i] * parseFloat(item.price),
  })).filter((item: ItemWithSelection) => item.quantity > 0);

  const subtotal = itemsWithSelection.reduce((sum: number, item: ItemWithSelection) => sum + item.cost, 0);
  const total = subtotal + tip;

  const insufficent = !!balance && parseFloat(balance) < total;

  return (
    <Fragment>
      <Container>
        <StartCheckoutButton onClick={() => setIsOpen(!isOpen)}>
          {insufficent ? 'Insufficent funds' : 'Checkout' }
        </StartCheckoutButton>
        <PanelContainer
          style={{ height: isOpen && panel.current ? `${panel.current.clientHeight}px` : undefined }}
        >
          <Panel ref={panel}>
            {itemsWithSelection.map((item: ItemWithSelection) => item.quantity > 0 && (
              <LineItem key={item.name}>
                <div>{item.name}{item.quantity > 1 && ` (${item.quantity})`}:</div>
                <div>{item.cost}</div>
              </LineItem>
            ))}

            <div>Subtotal: {subtotal} {asset.name}</div>

            <Field>
              <Label>Notes:</Label>
              <Notes
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                value={note}
              />
            </Field>

            <Field>
              <Label>Tip:</Label>
              <Stepper value={tip} onChange={(newTip: number) => setTip(newTip)} />
            </Field>

            <div>Total: {total} {asset.name}</div>

            <CheckoutButton
              onClick={() => onSend(total.toString(), createMessage(itemsWithSelection, tip, note))}
              disabled={insufficent}
            >
              {insufficent ? 'Insufficent funds' : 'Checkout' }
            </CheckoutButton>
          </Panel>
        </PanelContainer>
      </Container>
      {isOpen && <Background onClick={() => setIsOpen(false)} />}
    </Fragment>
  );
};

export default CheckoutBar;

