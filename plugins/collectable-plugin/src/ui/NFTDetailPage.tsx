import React, { Fragment, useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import CollectablePlugin, { NFT } from '../CollectablePlugin';

interface ClonePageParams {
  id: string;
}

const NFTDetailPage: React.FC<PluginPageContext<ClonePageParams>> = ({ burnerComponents, match, plugin }) => {
  const _plugin = plugin as CollectablePlugin;
  const [nft, setNft] = useState<NFT | null>(null);

  useEffect(() => {
    _plugin.getNFT(match.params.id).then(_nft => setNft(_nft));
  }, [match]);

  const { Page } = burnerComponents;
  return (
    <Page title={nft ? nft.name : 'Loading...'}>
      {nft ? (
        <Fragment>
          <img src={nft!.image} style={{ margin: '8px auto', display: 'block' }} />
          <div style={{ margin: '16px' }}>{nft!.name}</div>
          <div style={{ margin: '16px' }}>{nft!.description}</div>
          <div style={{ margin: '16px' }}>1 of {nft!.attributes.supplyCap} copies</div>
        </Fragment>
      ) : null}
    </Page>
  );
};

export default NFTDetailPage;
