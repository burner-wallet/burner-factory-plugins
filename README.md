# Burner Factory Plugins

http://burnerfactory.com

Burner Wallets used by the Burner Factory. These plugins are more complex than the plugins provided
in the Burner Wallet repository, they may require server components or deployed contracts.

## Plugins

* **Collectable Plugin**: Collect non-fungible tokens
* **Contract Wallet Plugin**: UI settings for using the _Contract Wallet Signer_
* **Order Menu Plugin**: Order food & drinks off an in-wallet menu
* **Push Notification Plugin**: Webpush notifications
* **Schedule Plugin**: Display an event schedule
* **Stock Market Menu Plugin**: Similar to _Order Menu Plugin_, but prices fluxuate with demand
* **Vendor Plugin**: Vendor side of the _Order Menu Plugin_, orders can be marked as complete

## Other modules

* **Contract Wallet Signer**: Proxy all on-chain calls through a counterfactual contract wallet,
  which enables additional features such as batch transactions, Gas Station Network, multi-sig
* **Token Exchange Pairs**: Vendable tokens can be exchanged using the _Exchange Plugin_
