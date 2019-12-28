import { Pair } from '@burner-wallet/exchange';

const VENDING_MACHINE_FN = '0x424f4fef';

export default class BackedTokenPair extends Pair {
  private vendingMachineAddress: string | null;
  private contract: any;

  constructor(token: string, native: string) {
    super({ assetA: token, assetB: native });
    this.vendingMachineAddress = null;
    this.contract = null; 
  }

  async getVendingMachineAddress() {
    if (!this.vendingMachineAddress) {
      const token = this.exchange.getAsset(this.assetA);
      const web3 = this.exchange.getWeb3(token.network);
      // @ts-ignore
      const response = await web3.eth.call({ data: VENDING_MACHINE_FN, to: token.address });
      this.vendingMachineAddress = web3.utils.toChecksumAddress(response.substr(26));
    }
    return this.vendingMachineAddress;
  }

  // TODO: Use ExchangeParams type
  async exchangeAtoB({ account, value, ether }: any) {
    const _value = this._getValue({ value, ether });
    const token = this.exchange.getAsset(this.assetA);

    return await token.send({
      from: account,
      value: _value,
      to: await this.getVendingMachineAddress(),
    });
  }

  // TODO: Use ExchangeParams type
  async exchangeBtoA({ account, value, ether }: any) {
    const _value = this._getValue({ value, ether });
    const native = this.exchange.getAsset(this.assetB);

    return await native.send({
      from: account,
      value: _value,
      to: await this.getVendingMachineAddress(),
    });
  }

  // TODO: Use ValueTypes type
  async estimateAtoB(value: any) {
    return this._getValue(value);
  }

  // TODO: Use ValueTypes type
  async estimateBtoA(value: any) {
    return this._getValue(value);
  }

}
