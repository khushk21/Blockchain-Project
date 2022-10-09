const Dns = artifacts.require("MockDns");

const { assert } = require('chai')

require('chai')
  .use(require('chai-as-promised'))
  .should()

// const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

function increaseTime(addSeconds) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [addSeconds],
      id,
    }, (err1) => {
      if (err1) return reject(err1);

      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => (err2 ? reject(err2) : resolve(res)));
    });
  });
}

contract("MockDns", async (accounts) => {

  describe('Unit test: Deployment', async () => {
    let dns
    before(async () => {
      dns = await Dns.new(180, 180, 60 * 60, 7 * 24 * 60 * 60); // get the deployed Dns contract
    })
    // accounts are the list of account created by the Truffle (i.e. 10 key pair)
    // by default, the first account will deploy the contract
    it("should make deployer the owner", async () => {
      let owner = await dns.owner(); // call the getter on public state variable, https://solidity.readthedocs.io/en/v0.7.1/contracts.html#getter-functions
      assert.equal(owner, accounts[0]); // compare the expected owner with the actual owner
    });

  })

  describe('Unit test: Core Functions', async () => {
    let dns
    before(async () => {
      dns = await Dns.new(180, 180, 60 * 60, 7 * 24 * 60 * 60); // get the deployed Dns contract
    })

    // Check that unregistered url is considered expired
    it("unregistered address should be expired", async () => {

      let result = await dns.checkExpired("test.ntu", {
        from: accounts[1]
      });
      assert.equal(result, true);
    });

    // Check that auction has ended on unregisterd url (since no auction has existed)
    it("unregistered url should have ended auction attached", async () => {

      let result = await dns.checkAuctionEnded("test.ntu", {
        from: accounts[1]
      });
      assert.equal(result, true);
    });

    // Checks that the URL can be registered and recalled
    it("can register and resolve url", async () => {

      await dns.testRegisterFunc("test.ntu", accounts[2], {
        from: accounts[0]
      });

      let address = await dns.getRegisteredURL("test.ntu");

      assert.equal(address, accounts[2]);
    });

    it("check can register another url", async () => {

      await dns.testRegisterFunc("test2.ntu", accounts[2], {
        from: accounts[0]
      });

      let address = await dns.getRegisteredURL("test2.ntu");
      assert.equal(address, accounts[2]);
    });

    it("check correct address list correct", async () => {

      await dns.testRegisterFunc("test3.ntu", accounts[3], {
        from: accounts[0]
      });

      let address_list = await dns.getAddresses({ from: accounts[2] })

      assert.equal(JSON.stringify(address_list), JSON.stringify([accounts[2], accounts[3]]));
    });

    it("check cannot register same address (not expired)", async () => {

      let result = await dns.testRegisterFunc("test3.ntu", accounts[4], {
        from: accounts[0]
      });

      const event = result.logs[0].args
      assert.equal(event._url, "not expired")
    });

    it("check old address deleted after no urls assigned to it", async () => {

      await increaseTime(2 * 60 * 60);
      await dns.testRegisterFunc("test3.ntu", accounts[4], {
        from: accounts[0]
      });

      let address_list = await dns.getAddresses({ from: accounts[2] })
      assert.equal(JSON.stringify(address_list), JSON.stringify([accounts[2], accounts[4]]));

    });

  })

  describe('Integration test: Auction Deploy Functions', async () => {
    let dns
    before(async () => {
      dns = await Dns.new(180, 180, 60 * 60, 7 * 24 * 60 * 60); // get the deployed Dns contract
    })

    it("check auction can be deployed", async () => {

      response = await dns.startAuction("tester.ntu", {
        from: accounts[5]
      });

      const event = response.logs[0].args
      assert.equal(event._url, "tester.ntu")

    });

    it("check auction cannot be started again", async () => {

      await truffleAssert.reverts(dns.startAuction("tester.ntu", {
        from: accounts[3]
      }));

    });

    it("check new auction can be created after grace period if no one ends it", async () => {

      await increaseTime(8 * 24 * 60 * 60);

      response = await dns.startAuction("tester.ntu", {
        from: accounts[5]
      });

      const event = response.logs[0].args
      assert.equal(event._url, "tester.ntu")

    });

  })

});
