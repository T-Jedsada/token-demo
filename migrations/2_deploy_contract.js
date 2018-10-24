var TweentyScoopsToken = artifacts.require("./TweentyScoopsToken.sol");
var TokenManager = artifacts.require("./TokenManager.sol");

module.exports = function(deployer) {
  deployer.deploy(TweentyScoopsToken).then(() => {
    return deployer.deploy(TokenManager, TweentyScoopsToken.address);
  });
};
