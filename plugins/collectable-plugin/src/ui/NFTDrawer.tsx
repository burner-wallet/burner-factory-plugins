import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PluginElementContext } from '@burner-wallet/types';
import CollectablePlugin, { NFT } from '../CollectablePlugin';
import Card from './Card';

const Container = styled.div`
  padding: 32px 0;
  min-height: 160px;
`;

const Heading = styled.h2`
  color: #919191;
  font-weight: normal;
  margin: 0;
  font-size: 18px;
  text-align: center;
`;

const NFTList = styled.ul`
  display: flex;
  overflow-x: auto;
  padding: 18px 0;
  margin: 0;
`;

const Item = styled.li`list-style: none;`;

const NFTDrawer: React.FC<PluginElementContext> = ({ accounts, actions, plugin }) => {
  const _plugin = plugin as CollectablePlugin;
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    if (accounts.length > 0) {
      let timer: number;
      const queryNfts = async () => {
        const _nfts = await _plugin.getNFTs(accounts[0]);
        setNfts(_nfts);
        timer = window.setTimeout(queryNfts, 1000);
      }
      queryNfts();

      return () => {
        if (timer) {
          window.clearInterval(timer);
        }
      };
    }
  }, [accounts]);

  return (
    <Container>
      {nfts.length === 0 ? (
        <Heading>No collectables yet... Go find some!</Heading>
      ) : (
        <NFTList>
          {nfts.map((nft, i) => (
            <Item key={nft.id}>
              <Card
                name={nft.name}
                image={nft.image}
                onClick={() => actions.navigateTo(`/nft/${nft.id}`)}
              />
            </Item>
          ))}
        </NFTList>
      )}
    </Container>
  );
};

export default NFTDrawer;
