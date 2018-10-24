import * as tokenManagerConfig from '../contracts/TweentyScoopsToken.json';

export default {
    address: tokenManagerConfig.networks['1540364383560'].address,
    decimal: 18,
    name: "20ScoopsToken",
    symbol: "SC",
    icon: "tweenty-scoops-icon.png",
    abi : tokenManagerConfig.abi
}