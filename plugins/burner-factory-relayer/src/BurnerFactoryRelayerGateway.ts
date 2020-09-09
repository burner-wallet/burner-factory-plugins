import Gateway from '@burner-wallet/core/gateways/Gateway';
import { soliditySha3 } from 'web3-utils';

interface TX {
  from: string;
  to: string;
  gasPrice: string;
  data: string;
  gasLimit: string;
  txFee: string;
  nonce: string;
  relay: string;
  hub: string;
  signature: string;
}

export default class BurnerFactoryRelayerGateway extends Gateway {
  private isOn = true;
  private server: string;

  constructor(server: string = 'https://relayer.burnerfactory.com') {
    super(['5', '42', '100']);
    this.server = server;
  }

  isAvailable() {
    return this.isOn;
  }

  async sendTx(network: string, payload: any) {
    if (payload.params[0].useGSN || payload.params[0].gasless) {
      try {
        const tx = await this.buildTx(network, payload.params[0]);

        tx.signature = await this.getSignature(tx);

        const txHash = await this.sendToRelay(network, tx);
        return txHash;
      } catch (e) {
        console.warn('Relay failed', e);
      }
    }

    return this.send(network, {
      ...payload,
      params: [payload.params[0].signedTransaction],
    });
  }

  async buildTx(network: string, { from, to, gasPrice = '1000000000', gasLimit, data }: any): Promise<TX> {
    const response = await fetch(`${this.server}/pre-relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ network, from, to, gasPrice, gasLimit, data }),
    });
    const json = await response.json();
    if (!json.canRelay) {
      throw new Error('Can not relay transaction');
    }

    const tx: TX = {
      from,
      to,
      gasPrice: '1100000000',
      data,
      gasLimit: json.gasLimit,
      txFee: json.txFee,
      nonce: json.nonce,
      relay: json.relay,
      hub: json.hub,
      signature: '',
    };
    return tx;
  }

  async getSignature(tx: TX) {
    const msg = soliditySha3("rlx:", tx.from, tx.to, tx.data, tx.txFee, { type: 'uint256', value: tx.gasPrice }, tx.gasLimit, tx.nonce, tx.hub, tx.relay);
    const signature = await this.core!.signMsg(msg!, tx.from);
    return signature;
  }

  async sendToRelay(network: string, tx: TX): Promise<string> {
    const request = await fetch(`${this.server}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ network, ...tx }),
    });
    const json = await request.json();
    if (json.error) {
      throw new Error(json.error);
    }

    return json.txHash;
  }

  async fixTransactionReceipt(response: any) {
    // TODO: is there anything to fix?
    return response;
  }

  async send(network: string, payload: any) {
    try {
      this.isOn = false;
      const request = this.core.handleRequest(network, payload);
      this.isOn = true;

      const response = await request;

      if (payload.method === 'eth_getTransactionReceipt' && response) {
        return this.fixTransactionReceipt(response);
      }

      return response;
    } catch (e) {
      this.isOn = true;
      throw e;
    }
  }
}
