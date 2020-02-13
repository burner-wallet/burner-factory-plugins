import React, { useState, Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { HistoryEvent } from '@burner-wallet/types';
import styled from 'styled-components';
import VendorPlugin from './VendorPlugin';
import Blockies from 'react-blockies';

const Checkbox = styled.input`
  transform: scale(2);
  padding-left: 10px;
`;

const Row = styled.div`
  display: flex;
  margin: 4px 0;
  padding: 4px;
  border-bottom: solid 1px #aaaaaa;
  align-items: center;
`;

const TXData = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Ammount = styled.div`
  font-size: 18px;
  text-align: right;
  margin-right: 10px;
`;

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface OrderPageProps {
  plugin: VendorPlugin;
}

const OrderPage: React.FC<OrderPageProps> = ({ plugin }) => {
  const { BurnerComponents, defaultAccount } = useBurner();
  const [, rerender] = React.useState();
  const [showComplete, setShowComplete] = useState(false);

  const setComplete = (tx: string, isComplete: boolean) => {
    plugin.setComplete(tx, isComplete);
    rerender({});
  };

  const { History, AddressName } = BurnerComponents;
  return (
    <Fragment>
      <label>
        Show complete orders
        <input
          type="checkbox"
          checked={showComplete}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowComplete(e.target.checked)}
        />
      </label>
      <History account={defaultAccount} render={(events: HistoryEvent[]) => {
        const incompleteOrders = showComplete
          ? events.filter((event: HistoryEvent) => event.getAsset())
          : events.filter((event: HistoryEvent) => event.getAsset() && !plugin.isComplete(event.tx));

        if (incompleteOrders.length === 0) {
          return (
            <Empty>No{showComplete || ' incomplete'} orders</Empty>
          );
        }

        return incompleteOrders.map((event: HistoryEvent) => (
          <Row key={event.tx}>
            <Blockies seed={event.from.toLowerCase()} />
            <TXData>
              <div>{event.message}</div>
              <Name>
                <AddressName address={event.from} render={(name: string | null, address: string) => name || address} />
              </Name>
            </TXData>
            <Ammount>{event.getDisplayValue()} {event.getAsset().name}</Ammount>
            <div>
              <Checkbox
                type="checkbox"
                checked={plugin.isComplete(event.tx)}
                onChange={(e: any) => setComplete(event.tx, e.target.checked)}
              />
            </div>
          </Row>
        ));
      }} />
    </Fragment>
  );
};

export default OrderPage;
