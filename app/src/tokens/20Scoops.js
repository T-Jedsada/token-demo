import * as tokenManagerConfig from '../contracts/TweentyScoopsToken.json';

export default {
  address: tokenManagerConfig.networks['1234567'].address,
  decimal: 5,
  name: '20ScoopsToken',
  symbol: '20S',
  icon: 'ic_20scoops.png',
  abi: tokenManagerConfig.abi
};
