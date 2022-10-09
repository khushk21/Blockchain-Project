const { assert } = require('chai')

const { soliditySha3, toWei, fromAscii, eth } = require("web3-utils");

const BigNumber = require('bignumber.js');

const Dns = artifacts.require("Dns");

const BlindAuction = artifacts.require('./BlindAuction.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

// mock contracts to increase in time to test time bounding functionalities
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


// accounts are test accounts on local network
contract('BlindAuction', ([deployer, bidder1, bidder2, bidder3]) => {
  describe('Unit test: Deployment', async () => {
    let blindAuction
    let dns
    let deployURL
    before(async () => {
      dns = await Dns.deployed(); // get the deployed Dns contract
      deployURL = "dns.ntu"
      const deployBlindAuction = await dns.startAuction(deployURL)
      const deployEvent = deployBlindAuction.logs[0].args
      auctionAddress = deployEvent._auction_addr
      blindAuction = await BlindAuction.at(auctionAddress)
    })
    it('deploys successfully', async () => {
      const address = await blindAuction.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('should have url', async () => {
      const url = await blindAuction.url()
      assert.equal(url, deployURL)
    })

    it('should have DNS Manager Address', async () => {
      const dnsManager = await blindAuction.dnsManagerAddress()
      assert.equal(dns.address, dnsManager)
    })

    it('should have default winner', async () => {
      const highestBidder = await blindAuction.highestBidder()
      assert.equal(deployer, highestBidder, "Default Highest bidder should be auction starter")
    })

    it('should have default highest bid', async () => {
      const highestBid = await blindAuction.highestBid()
      assert.equal(0, highestBid, "Default Highest bid should be 0")
    })

    it('should have bidding time', async () => {
      const biddingEnd = BigNumber(await blindAuction.biddingEnd())
      const endTime = biddingEnd.c[0]
      // check that bidding end is above current time
      assert.isAbove(endTime, Math.floor(Date.now() / 1000))
    })

    it('should have reveal time', async () => {
      const biddingEnd = BigNumber(await blindAuction.biddingEnd())
      const biddingTime = biddingEnd.c[0]
      const revealEnd = BigNumber(await blindAuction.revealEnd())
      const revealTime = revealEnd.c[0]
      // check that reveal end above current time
      assert.isAbove(revealTime, Math.floor(Date.now() / 1000))
      // check that reveal end is above bidding end
      assert.isAbove(revealTime, biddingTime)
    })

  })

  describe('Unit test: Functions', async () => {
    let blindAuction

    it('should have default winner', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      const highestBidder = await blindAuction.highestBidder()
      assert.equal(bidder2, highestBidder, "Default Highest bidder should be auction starter")
    })

    it('should be able to send bid', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      const hashBid = soliditySha3(
        toWei("0.1"), // hash need to change to wei
        true,
        fromAscii("secret").padEnd(66, 0)
      );
      const bid = await blindAuction.bid(hashBid, { from: bidder1, value: toWei("0.1") })
      const bidEvent = bid.logs[0].args
      assert.equal(bidEvent.bidHash, hashBid, 'Bid Hashed bid should be hashbid passed in')
      assert.equal(bidEvent.deposit, toWei("0.1"), 'Bid Deposit should be 0.1 Ether')
      assert.equal(bidEvent.bidder, bidder1, 'Bid bidder should be bidder1')
    })

    it('should not be able to send blank bid', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      // FAILURE: bid must have blinded bid content
      await blindAuction.bid("", bidder1).should.be.rejected;
    })

    it('should not be able reveal before bidding phase has ended', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      await blindAuction.reveal([toWei("0.1")], [true], [fromAscii("secret")], { from: bidder1 }).should.be.rejected
    })

    it('should be able reveal bids', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      const hashBid = soliditySha3(
        toWei("0.2"), // hash need to change to Wei
        true,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      await blindAuction.bid(hashBid, { from: bidder2, value: toWei("0.2") })
      await increaseTime(11)
      const revealBidder = await blindAuction.reveal([toWei("0.2")], [true], [fromAscii("secret")], { from: bidder2 })
      const revealEvent = revealBidder.logs[0].args
      assert.equal(revealEvent.deposits, 0, 'Bidder2 Deposits should be 0 as deposit taken as highest bid')
      assert.equal(revealEvent.balances, 0, "bidder2 balance should be 0 as only can reveal once")
      assert.equal(revealEvent.bidder, bidder2, "bidder2 should be present in bidder list that has revealed already")
    })

    it('should not be able reveal invalid reveals - wrong number of total bids', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      const hashBid = soliditySha3(
        toWei("0.2"), // hash need to change to Wei
        true,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      const hashBid2 = soliditySha3(
        toWei("0.05"), // hash need to change to Wei
        false,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      await blindAuction.bid(hashBid, { from: bidder2, value: toWei("0.2") })
      await blindAuction.bid(hashBid2, { from: bidder2, value: toWei("0.05") })
      await increaseTime(11)
      const revealBidder = await blindAuction.reveal([toWei("0.2")], [true], [fromAscii("secret")], { from: bidder2 }).should.be.rejected
    })

    it('should not be able bid in reveal phase', async () => {
      blindAuction = await BlindAuction.new(10, 10, "dns.ntu", deployer, bidder2)
      const hashBid = soliditySha3(
        toWei("0.05"), // hash need to change to Wei
        false,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      await increaseTime(11)
      await blindAuction.bid(hashBid, { from: bidder3, value: toWei("0.05") }).should.be.rejected
    })

  })

  // Test when 2 bidders bid their own bids and all have valid bids
  // Bidder2 will emerge as the winner due to the highest bid of 0.2
  // Test rejecting calls to various function due to the time check 
  // function calls that are called before the time bounds will be checked
  // if they are rejected
  describe('Integration Test: 2 Bidders Success Case', async () => {
    let blindAuction
    let dns
    let deployURL

    let hashBid1
    let hashBid2
    let hashBid3

    let bid1
    let bid2
    let bid3

    let revealBidder1
    let revealBidder2

    let bidder1Balance
    let bidder2Balance

    let auctionEnd

    before(async () => {
      // deploy DNS contract and auction contract
      dns = await Dns.deployed(); // get the deployed Dns contract
      deployURL = "dns2.ntu"
      const deployBlindAuction = await dns.startAuction(deployURL)
      const deployEvent = deployBlindAuction.logs[0].args
      auctionAddress = deployEvent._auction_addr
      blindAuction = await BlindAuction.at(auctionAddress)
      // use URL below for keccak256 hash in JS
      // https://blog.8bitzen.com/posts/18-03-2019-keccak-abi-encodepacked-with-javascript/
      // remember change secret to bytes
      // pad secret to be 32bytes cause the solidity contract will convert it to bytes32 to hash
      // hash would be different if dont pad
      hashBid1 = soliditySha3(
        toWei("0.1"), // hash need to change to wei
        true,
        fromAscii("secret").padEnd(66, 0)
      );
      hashBid2 = soliditySha3(
        toWei("0.2"), // hash need to change to Wei
        true,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      hashBid3 = soliditySha3(
        toWei("0.05"), // hash need to change to Wei
        false,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      // Sequential order of contract function calls as function can only be called after each other
      // therefore all to be called in sequence first to ensure they are executed in order
      // if not JS Async may cause some to execute out of order causing error
      // Create 3 bids
      bid1 = await blindAuction.bid(hashBid1, { from: bidder1, value: toWei("0.1") })
      bid2 = await blindAuction.bid(hashBid2, { from: bidder2, value: toWei("0.2") })
      bid3 = await blindAuction.bid(hashBid3, { from: bidder2, value: toWei("0.05") })
      // should not be able call auction end before bidding ended
      await blindAuction.auctionEnd().should.be.rejected
      // move time ahead by 10s so that can test onlyAfter & onlyBefore
      // for reveal bid to ensure it is after bidding time end and before reveal time end
      // await blindAuction.moveAheadBiddingTime(11) // mock moving ahead by 11s (10s is time to bidding end)
      await increaseTime(181);
      // NOTE: all ether values to be converted to Wei 
      // reveal for both users with their respective correct bids
      // should not be able call auction end before reveal ended
      await blindAuction.auctionEnd().should.be.rejected
      revealBidder1 = await blindAuction.reveal([toWei("0.1")], [true], [fromAscii("secret")], { from: bidder1 })
      revealBidder2 = await blindAuction.reveal([toWei("0.2"), toWei("0.05")], [true, false], [fromAscii("secret"), fromAscii("secret")], { from: bidder2 })
      // should reject reveal second time from same user
      await blindAuction.reveal([toWei("0.2"), toWei("0.05")], [true, false], [fromAscii("secret"), fromAscii("secret")], { from: bidder2 }).should.be.rejected
      // bidding should be rejected as well as pass bidding time
      await blindAuction.bid(hashBid3, { from: bidder3, value: toWei("0.05") }).should.be.rejected
      // move time ahead by 10s so that can test onlyAfter & onlyBefore
      // for end auction to ensure it is after reveal time end
      // await blindAuction.moveAheadRevealTime(21) // mock moving ahead by 21s (20s is time to reveal end)
      await increaseTime(181);
      // bidding should be rejected as well as pass bidding time
      await blindAuction.bid(hashBid3, { from: bidder3, value: toWei("0.05") }).should.be.rejected
      // reveal should be rejected as pass reveal time
      await blindAuction.reveal([toWei("0.2"), toWei("0.05")], [true, false], [fromAscii("secret"), fromAscii("secret")], { from: bidder2 }).should.be.rejected

      bidder1Balance = await web3.eth.getBalance(bidder1)
      bidder2Balance = await web3.eth.getBalance(bidder2)
      auctionEnd = await blindAuction.auctionEnd()
    })
    it('send bid', async () => {
      const eventBid1 = bid1.logs[0].args
      assert.equal(eventBid1.bidHash, hashBid1, 'Bid1 Hashed bid should be hashbid passed in')
      assert.equal(eventBid1.deposit, toWei("0.1"), 'Bid1 Deposit should be 0.1 Ether')
      assert.equal(eventBid1.bidder, bidder1, 'Bid1 bidder should be bidder1')
      const eventBid2 = bid2.logs[0].args
      assert.equal(eventBid2.bidHash, hashBid2, 'Bid2 Hashed bid should be hashbid passed in')
      assert.equal(eventBid2.deposit, toWei("0.2"), 'Bid2 Deposit should be 0.2 Ether')
      assert.equal(eventBid2.bidder, bidder2, 'Bid2 bidder should be bidder2')
      const eventBid3 = bid3.logs[0].args
      assert.equal(eventBid3.bidHash, hashBid3, 'Bid3 Hashed bid should be hashbid passed in')
      assert.equal(eventBid3.deposit, toWei("0.25"), 'Bid3 Deposit should be 0.25 Ether (0.2 + 0.05)')
      assert.equal(eventBid3.bidder, bidder2, 'Bid3 bidder should be bidder2')
      // FAILURE: bid must have blinded bid content
      await blindAuction.bid("", bidder1).should.be.rejected;
    })

    it('reveal bid', async () => {
      const eventBidder1 = revealBidder1.logs[0].args
      const eventBidder2 = revealBidder2.logs[0].args
      assert.equal(eventBidder1.deposits, 0, 'Bidder 1 Deposits should be 0 as bid is highest at point of time')
      assert.equal(eventBidder1.balances, 0, "bidder1 balance should be 0 as only can reveal once")
      assert.equal(eventBidder1.bidder, bidder1, "bidder1 should be present in bidder list that has revealed already")
      assert.equal(eventBidder2.deposits, toWei("0.05"), 'Bidder 2 Deposits should be 0.05 as bid3 deposit should be returned')
      assert.equal(eventBidder2.balances, 0, "bidder2 balance should be 0 as only can reveal once")
      assert.equal(eventBidder2.bidder, bidder2, "bidder2 should be present in bidder list that has revealed already")
    })

    it('auction end', async () => {
      const event = auctionEnd.logs[0].args
      const highestBidder = await blindAuction.highestBidder()
      const highestBid = await blindAuction.highestBid()
      assert.equal(event.winner, bidder2, 'Winner of auction should be bidder2')
      assert.equal(highestBidder, bidder2, 'getHighestBidder function should return bidder2')
      // NOTE: all ether values to be converted to Wei 
      assert.equal(event.highestBid, toWei("0.2"), 'Highest bid of auction should be 0.2')
      assert.equal(highestBid, toWei("0.2"), 'getHighestBid should return 0.2')
      assert.equal(event.currentValue, toWei('0.15'), 'Current value of contract should be 0.15 (0.1 from bidder1 + 0.05 from fake bid bidder 2)')
      // test withdrawal conducted in auctionEnd
      const withdrawEventBidder1 = auctionEnd.logs[1].args
      const withdrawEventBidder2 = auctionEnd.logs[2].args
      assert.equal(withdrawEventBidder1.amount, toWei("0.1"), 'Withdrawal bidder1 amount should be 0.1')
      assert.equal(withdrawEventBidder2.amount, toWei("0.05"), 'Withdrawal bidder2 amount should be 0.05')
      // check if URL is registered in dns contract
      const urlAddress = await dns.getRegisteredURL(deployURL)
      assert.equal(event.winner, urlAddress, "Address of winner should be registered as owner in DNS manager")

      // ensure refund is actually given to users by checking their accounts
      const bidder1BalanceNow = await web3.eth.getBalance(bidder1) - toWei("0.1")
      const bidder2BalanceNow = await web3.eth.getBalance(bidder2) - toWei("0.05")
      assert.equal(bidder1Balance, bidder1BalanceNow, "Bidder1 should have balance increase by 0.1 ether")
      assert.equal(bidder2Balance, bidder2BalanceNow, "Bidder2 should have balance increase by 0.05 ether")
    })

  })

  describe('Integration Test: Bidder2 bid with not enough value', async () => {
    let blindAuction
    let dns
    let deployURL

    let hashBid1
    let hashBid2

    let bid1
    let bid2

    let revealBidder1
    let revealBidder2

    let bidder1Balance
    let bidder2Balance

    let auctionEnd

    before(async () => {
      // deploy DNS contract and auction contract
      dns = await Dns.deployed(); // get the deployed Dns contract
      deployURL = "dns3.ntu"
      const deployBlindAuction = await dns.startAuction(deployURL)
      const deployEvent = deployBlindAuction.logs[0].args
      auctionAddress = deployEvent._auction_addr
      blindAuction = await BlindAuction.at(auctionAddress)
      hashBid1 = soliditySha3(
        toWei("0.1"), // hash need to change to wei
        true,
        fromAscii("secret").padEnd(66, 0)
      );
      hashBid2 = soliditySha3(
        toWei("0.2"), // hash need to change to Wei
        true,
        fromAscii("secret").padEnd(66, 0) // pad with 66 '0s' so that fit byte32 to match sol func
      );
      bid1 = await blindAuction.bid(hashBid1, { from: bidder1, value: toWei("0.1") })
      bid2 = await blindAuction.bid(hashBid2, { from: bidder2, value: toWei("0.01") })
      // mock moving ahead by 181s (180s is time to bidding end)
      await increaseTime(181);
      revealBidder1 = await blindAuction.reveal([toWei("0.1")], [true], [fromAscii("secret")], { from: bidder1 })
      revealBidder2 = await blindAuction.reveal([toWei("0.2")], [true], [fromAscii("secret")], { from: bidder2 })
      // mock moving ahead by 181s (180s is time to reveal end)
      await increaseTime(181);
      bidder1Balance = await web3.eth.getBalance(bidder1)
      bidder2Balance = await web3.eth.getBalance(bidder2)
      auctionEnd = await blindAuction.auctionEnd()
    })
    it('send bid', async () => {
      const eventBid1 = bid1.logs[0].args
      assert.equal(eventBid1.bidHash, hashBid1, 'Bid1 Hashed bid should be hashbid passed in')
      assert.equal(eventBid1.deposit, toWei("0.1"), 'Bid1 Deposit should be 0.1 Ether')
      assert.equal(eventBid1.bidder, bidder1, 'Bid1 bidder should be bidder1')
      const eventBid2 = bid2.logs[0].args
      assert.equal(eventBid2.bidHash, hashBid2, 'Bid2 Hashed bid should be hashbid passed in')
      assert.equal(eventBid2.deposit, toWei("0.01"), 'Bid2 Deposit should be 0.2 Ether')
      assert.equal(eventBid2.bidder, bidder2, 'Bid2 bidder should be bidder2')
    })

    it('reveal bid', async () => {
      const eventBidder1 = revealBidder1.logs[0].args
      const eventBidder2 = revealBidder2.logs[0].args
      assert.equal(eventBidder1.deposits, 0, 'Bidder 1 Deposits should be 0 as bid is highest at point of time')
      assert.equal(eventBidder1.balances, 0, "bidder1 balance should be 0 as only can reveal once")
      assert.equal(eventBidder1.bidder, bidder1, "bidder1 should be present in bidder list that has revealed already")
      assert.equal(eventBidder2.deposits, toWei("0.01"), 'Bidder 2 Deposits should be 0.01 as bid was rejected due to not enough value')
      assert.equal(eventBidder2.balances, 0, "bidder2 balance should be 0 as only can reveal once")
      assert.equal(eventBidder2.bidder, bidder2, "bidder2 should be present in bidder list that has revealed already")
    })

    it('auction end', async () => {
      const event = auctionEnd.logs[0].args
      const highestBidder = await blindAuction.highestBidder()
      const highestBid = await blindAuction.highestBid()
      assert.equal(event.winner, bidder1, 'Winner of auction should be bidder1')
      assert.equal(highestBidder, bidder1, 'getHighestBidder function should return bidder1')
      // NOTE: all ether values to be converted to Wei 
      assert.equal(event.highestBid, toWei("0.1"), 'Highest bid of auction should be 0.1')
      assert.equal(highestBid, toWei("0.1"), 'getHighestBid should return 0.1')
      assert.equal(event.currentValue, toWei('0.01'), 'Current value of contract should be 0.01 (0.01 from rejected bid bidder 2)')
      // test withdrawal conducted in auctionEnd
      const withdrawEventBidder1 = auctionEnd.logs[1].args
      const withdrawEventBidder2 = auctionEnd.logs[2].args
      assert.equal(withdrawEventBidder1.amount, 0, 'Withdrawal bidder1 amount should be 0')
      assert.equal(withdrawEventBidder2.amount, toWei("0.01"), 'Withdrawal bidder2 amount should be 0.01')
      // check if URL is registered in dns contract
      const urlAddress = await dns.getRegisteredURL(deployURL)
      assert.equal(event.winner, urlAddress, "Address of winner should be registered as owner in DNS manager")
      // ensure refund is actually given to users by checking their accounts
      const bidder1BalanceNow = await web3.eth.getBalance(bidder1)
      const bidder2BalanceNow = await web3.eth.getBalance(bidder2) - toWei("0.01")
      assert.equal(bidder1Balance, bidder1BalanceNow, "Bidder1 should have balance increase by 0 ether")
      assert.equal(bidder2Balance, bidder2BalanceNow, "Bidder2 should have balance increase by 0.01 ether")

    })

  })
})