import * as tokenManagerConfig from '../contracts/TokenManager.json';

let TokenManager = null;
let selectedNetwork = null;
let supportedNetworks = Object.keys(tokenManagerConfig.networks);

export default class TokenManagerContract {

  constructor() {
    throw new Error('Do not instantiate!');
  }

  static getSupportedNetworks = () => {
    return supportedNetworks;
  };

  static setNetwork = networkId => {
    if (supportedNetworks.indexOf(networkId) < 0) {
      throw new Error(
        `No configuration defined for network:${networkId}. Application supports only ${supportedNetworks.join(
          ','
        )}`
      );
    }
    selectedNetwork = networkId;
    let { web3 } = window;

    // initialize contracts
    TokenManager = web3.eth
      .contract(tokenManagerConfig.abi)
      .at(tokenManagerConfig.networks[selectedNetwork].address);
  };

  static TokenManager() {
    if (!TokenManager)
      throw new Error(
        `You must first define the network. Call Contract.setNetwork}`
      );
    return TokenManager;
  }

  static isTokenManagerBytecode(bytecode) {
    return tokenManagerConfig.deployedBytecode === bytecode;
  }
}