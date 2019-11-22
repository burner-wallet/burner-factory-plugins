import { expect } from 'chai';
import 'mocha';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { Gateway } from '@burner-wallet/core/gateways';
import ContractWalletSigner from '../src/ContractWalletSigner';

const TEST_PK = '0x2054d094925e481cb81db7aae12fd498c95c6d20e8f998b62cbccfc18d22d5c9';

describe('ContractWalletSigner', () => {
  it('should convert ', () => {
    const localSigner = new LocalSigner({ privateKey: TEST_PK, saveKey: false });
    const contractSigner = new ContractWalletSigner();

    const testGateway = {} as Gateway;

    const core = new BurnerCore({
      signers: [contractSigner, localSigner],
      gateways: [testGateway],
      historyOptions: { storeHistory: false },
    });

    expect(core.getAccounts()).to.eql([
      '0x82e1dD26775C36589CA39516B34f47cffc9066XX',
      '0x82e1dD26775C36589CA39516B34f47cffc9066d1',
    ]);
  });
});
