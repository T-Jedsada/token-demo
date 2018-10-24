var path = require('path');

module.exports = {
  contracts_build_directory: path.join(__dirname, 'app/src/contracts/'),
  solc: {
    optimizer: {
      enabled: true,
      runs: 2000
    }
  },
  mocha: {
    useColors: true,
    enableTimeouts: false
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  }
};