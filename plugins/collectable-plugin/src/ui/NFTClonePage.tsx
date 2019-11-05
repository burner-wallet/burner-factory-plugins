import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import CollectablePlugin from '../CollectablePlugin';

interface ClonePageParams {
  id: string;
}

const NFTClonePage: React.FC<PluginPageContext<ClonePageParams>> = ({
  burnerComponents, match, plugin, history, defaultAccount
}) => {
  const _plugin = plugin as CollectablePlugin;
  const [status, setStatus] = useState('');

  const clone = async () => {
    if (!(await _plugin.canClone(match.params.id))) {
      return setStatus('This collectable can\'t be claimed');
    }

    setStatus('Claiming...')
    const newId = await _plugin.cloneNFT(match.params.id, defaultAccount)
    history.replace(`/nft/${newId}`);
  };

  useEffect(() => {
    clone().catch(err => {
      console.error(err);
      setStatus('Error claiming');
    });
  }, [match]);

  const { Page } = burnerComponents;
  return (
    <Page title="Claim Collectable">
      {status}
    </Page>
  );
};

export default NFTClonePage;
