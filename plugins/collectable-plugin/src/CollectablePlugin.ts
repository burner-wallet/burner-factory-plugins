import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import abi from './abi/Collectable.json';
import NFTDrawer from './ui/NFTDrawer';
import NFTDetailPage from './ui/NFTDetailPage';
import NFTClonePage from './ui/NFTClonePage';

const range = (num: number) => [...Array(num).keys()];

export interface NFT {
  id: string;
  attributes: { [trait: string]: any };
  [metaKey: string]: any;
}

export default class CollectablePlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;
  private network: string;
  private address: string;
  private nftCache: { [id: string]: NFT };
  private contract?: any;

  constructor(network: string, address: string) {
    this.network = network;
    this.address = address;
    this.nftCache = {};
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
    pluginContext.addElement('home-tab', NFTDrawer, { title: 'Collectables' });
    pluginContext.addPage('/nft/:id', NFTDetailPage);
    pluginContext.addPage('/clone/:id', NFTClonePage);
  }

  getContract() {
    if (!this.contract) {
      const web3 = this.pluginContext!.getWeb3(this.network);
      this.contract = new web3.eth.Contract(abi, this.address);
    }
    return this.contract;
  }

  async getNFTs(address: string) {
    const contract = this.getContract();
    const numNFTs = await contract.methods.balanceOf(address).call();
    const nfts = await Promise.all(range(parseInt(numNFTs)).map(async index => {
      const nftId = await contract.methods.tokenOfOwnerByIndex(address, index).call();
      return await this.getNFT(nftId);
    }));
    return nfts;
  }

  async getNFT(id: string) {
    if (!this.nftCache[id]) {
      const contract = this.getContract();
      const uri = await contract.methods.tokenURI(id).call();
      const response = await fetch(uri);
      const metadata = await response.json();
      const attributes = metadata.attributes.reduce((obj: any, { trait_type, value }: any) => {
        obj[trait_type] = value;
        return obj;
      }, {});
      this.nftCache[id] = {
        ...metadata,
        attributes,
        id,
      };
    }

    return this.nftCache[id];
  }

  async canClone(id: string) {
    const web3 = this.pluginContext!.getWeb3(this.network);
    const contract = this.getContract();
    const { numClonesAllowed, numClonesInWild } = await contract.methods.getCollectablesById(id).call();
    return web3.utils.toBN(numClonesInWild).lt(web3.utils.toBN(numClonesAllowed));
  }

  async cloneNFT(id: string, account: string) {
    const contract = this.getContract();

    const previouslyClonedId = await contract.methods.getClonedTokenByAddress(account, id).call();
    if (previouslyClonedId !== '0') {
      return previouslyClonedId;
    }

    const receipt = await contract.methods.clone(account, id).send({ from: account });
    return receipt.events.Transfer.returnValues.tokenId;
  }
}
