const assert = require('assert')
const TokenManger = artifacts.require('./TokenManager.sol');

let tokenManager;

contract('Token Manger', async (accounts) => {

    beforeEach(async () => {
        tokenManager = await TokenManger.new();
        await tokenManager.addNewToken('OPEN', '0x69c4bb240cf05d51eeab6985bab35527d04a8c64');
    });

    it("should add new supported token", async() => {
        let address = await tokenManager.tokens.call('OPEN');
        assert.equal(address, '0x69c4bb240cf05d51eeab6985bab35527d04a8c64')
    });

    it("should update supported token address", async() => {
        await tokenManager.addNewToken('OPEN', '0x3472059945ee170660a9a97892a3cf77857eba3a');
        let address = await tokenManager.tokens.call('OPEN');
        assert.equal(address, '0x3472059945ee170660a9a97892a3cf77857eba3a');
    });

    it("should remove unused supported token address", async() => {
        await tokenManager.removeToken('OPEN');
        let address = await tokenManager.tokens.call('OPEN');
        assert.equal(address, '0x0000000000000000000000000000000000000000');
    });
});