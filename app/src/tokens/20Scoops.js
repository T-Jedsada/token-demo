import * as tokenManagerConfig from '../contracts/TweentyScoopsToken.json';

export default {
  address: tokenManagerConfig.networks['1540388236758'].address,
  decimal: 18,
  name: '20ScoopsToken',
  symbol: 'SC',
  icon: 'ic_20scoops.png',
  abi: tokenManagerConfig.abi
};
