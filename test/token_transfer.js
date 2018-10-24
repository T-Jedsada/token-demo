const assert = require('assert')
const TokenManger = artifacts.require('./TokenManager.sol');
const TweentyScoopsToken = artifacts.require('./TweentyScoopsToken.sol');

const BigNumber = web3.BigNumber;
let tokenManager, tweentyScoopsToken;

contract('token_management', async (accounts) => {

    let accountA, accountB;

    [accountA, accountB] = accounts;

    beforeEach(async () => {
        tokenManager = await TokenManger.new();
        tweentyScoopsToken = await TweentyScoopsToken.new();
        await tokenManager.addNewToken('SC', tweentyScoopsToken.address);
    });

    it("should be able to transfer sender token to another wallet", async() => {
        let amount = new BigNumber(50000000000);
        await tweentyScoopsToken.approve(tokenManager.address, amount,{from: accountA});
        await tokenManager.transferTokens('SC',accountB, amount,{from: accountA});
        let balance = ((await  tweentyScoopsToken.balanceOf(accountB)).toString());
        assert.equal(balance, amount.toString())
    });
});