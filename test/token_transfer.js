const assert = require("assert");
const TokenManger = artifacts.require("./TokenManager.sol");
const TweentyScoopsToken = artifacts.require("./TweentyScoopsToken.sol");

const BigNumber = web3.BigNumber;
let tokenManager, tweentyScoopsToken;

contract("token_management", async accounts => {
  beforeEach(async () => {
    tweentyScoopsToken = await TweentyScoopsToken.new();
    tokenManager = await TokenManger.new(tweentyScoopsToken.address);
  });

  it("should be able to transfer sender token to another wallet", async () => {
    let amount = new BigNumber(999);
    const txApprove = await tweentyScoopsToken.approve(
      tokenManager.address,
      amount
    );
    assert.ok(txApprove);
    const txTransfer = await tokenManager.transferTokens(accounts[1], amount);
    assert.ok(txTransfer);
    let balance = (await tweentyScoopsToken.balanceOf(accounts[1])).toString();
    assert.equal(balance, amount.toString());
  });
});
