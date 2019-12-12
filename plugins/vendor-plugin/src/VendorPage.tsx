import React, { useState, useEffect } from 'react';
import { PluginPageContext, HistoryEvent } from '@burner-wallet/types';
import styled from 'styled-components';
import VendorPlugin from './VendorPlugin';

const Checkbox = styled.input`
  transform: scale(2);
`;

const Row = styled.div`
  display: flex;
  margin: 4px 0;
  padding: 4px;
  border-bottom: solid 1px #aaaaaa;
`;

const TXData = styled.div`
  flex: 1;
`;

const VendorPage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, defaultAccount, assets }) => {
  const _plugin = plugin as VendorPlugin;

  const [menu, setMenu] = useState<any>(null);
  const [, rerender] = React.useState();
  
  useEffect(() => {
    _plugin.getMenu().then((_menu: any) => setMenu(_menu));
  }, []);

  if (!menu) {
    return null;
  }

  const setHidden = (tx: string) => {
    _plugin.setComplete(tx, true);
    rerender({});
  };

  return (
    <BurnerComponents.Page title="Vendor">
      <BurnerComponents.History account={defaultAccount} render={(events: HistoryEvent[]) => (
        events
          .filter((event: HistoryEvent) => event.getAsset() && !_plugin.isComplete(event.tx))
          .map((event: HistoryEvent) => (
          <Row key={event.tx}>
            <TXData>
              <div>{event.from}</div>
              <div>{event.message}</div>
              <div>{event.getDisplayValue()}</div>
            </TXData>
            <div>
              <Checkbox type="checkbox" onChange={() => setHidden(event.tx)} />
            </div>
          </Row>
        ))
      )} />
    </BurnerComponents.Page>
  );
};

export default VendorPage;
