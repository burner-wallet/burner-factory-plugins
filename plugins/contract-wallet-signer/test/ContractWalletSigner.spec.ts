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
    const contractSigner = new ContractWalletSigner('0x745a85748eEfD1d5927265CBec7087214C1a5b1c');

    const testGateway = {} as Gateway;

    const core = new BurnerCore({
      signers: [contractSigner, localSigner],
      gateways: [testGateway],
      historyOptions: { storeHistory: false },
    });

    expect(core.getAccounts()).to.eql([
      '0x7f50d23a0ab0eda89b0ae88e5a37bf30feb2bc70',
      '0x82e1dD26775C36589CA39516B34f47cffc9066d1',
    ]);
  });

  it('should calculate the address of the inner factory', () => {
    const contractSigner = new ContractWalletSigner('0x745a85748eEfD1d5927265CBec7087214C1a5b1c');
    expect(contractSigner.innerFactoryAddress).to.equal('0x35fb13688f44dfcf3ae8ac508bbfceab420762e0');
  });

  it('should calculate a wallet address', () => {
    const contractSigner = new ContractWalletSigner('0x450C8A2545b8387aE9764bF5e60344054e85d0Cb');
    const walletAddress = contractSigner.getWalletAddress('0x12F745A338736b01f87d3710a471AD194215EECe');
    expect(walletAddress).to.equal('0x3939fd705379bd1d3d98b186f51fc5171bce1db0');
  });
});
