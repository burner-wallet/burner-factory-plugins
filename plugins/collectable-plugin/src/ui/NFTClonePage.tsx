import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import CollectablePlugin from '../CollectablePlugin';

interface ClonePageParams {
  id: string;
}

const NFTClonePage: React.FC<PluginPageContext<ClonePageParams>> = ({
  BurnerComponents, match, plugin, history, defaultAccount
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

  return (
    <BurnerComponents.Page title="Claim Collectable">
      {status}
    </BurnerComponents.Page>
  );
};

export default NFTClonePage;
