pragma solidity >0.4.23 <0.7.0;

import "./Dns.sol";

contract BlindAuction {
    // address of DNS manager to register domain after auction ends
    address payable public dnsManagerAddress;

    // Keep track of ending time of bidding phase
    uint256 public biddingEnd;
    // Keep track of ending time of reveal phase
    uint256 public revealEnd;
    // Domain that is being auctioned
    string public url;
    // Keep track of if auction has ended or not
    bool public ended;

    // Keep track of all bids every user had made
    mapping(address => bytes32[]) public bids;
    // Keep track of all deposits every user had deposited
    mapping(address => uint256) deposits;

    // Current winner's address
    address public highestBidder;
    // Current winner's bid value
    uint256 public highestBid;

    // Keep track of how much ether needs to be returned to each user
    mapping(address => uint256) pendingReturns;
    // Keep track of which user has already revealed their bids
    address[] private reveal_list;

    // Event after each bid is created
    event BidCreated(
        bytes32 bidHash,
        uint256 deposit,
        address bidder,
        uint256 value
    );

    // Event after each reveal
    event Reveal(
        uint256 deposits, 
        uint256 balances, 
        address bidder
    );

    // Event after auction has ended
    event AuctionEnded(
        address winner,
        uint256 highestBid,
        uint256 currentValue
    );

    // Event to refund ether to every user
    event WithdrawEther(
        uint256 amount, 
        address recipient
    );

    // Modifiers are a convenient way to validate inputs to
    // functions. `onlyBefore` is applied to `bid` below:
    // The new function body is the modifier's body where
    // `_` is replaced by the old function body.
    
    // ensure current time is before certain bounds
    modifier onlyBefore(uint256 _time) {
        require(now < _time);
        _;
    }
    // ensure current time is after certain bounds
    modifier onlyAfter(uint256 _time) {
        require(now > _time);
        _;
    }

    constructor(
        uint256 _biddingTime,
        uint256 _revealTime,
        string memory _url,
        address payable _dnsManagerAddress,
        address _auctionStarter
    ) public payable {
        dnsManagerAddress = _dnsManagerAddress;
        // default winner of auction is auction starter
        highestBidder = _auctionStarter;
        // default highest bid is 0 before any bids made
        highestBid = 0;
        url = _url;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }

    // Place a blinded bid with `_blindedBid` =
    // keccak256(abi.encodePacked(value, real, secret)).
    // The sent ether is only refunded if the bid is correctly
    // revealed in the revealing phase. The bid is valid if the
    // ether deposited in all bids sent by that user
    // is at least "value" of non-fake bids which are when
    // "real" is true.
    // Setting "real" to false and sending
    // not the exact amount are ways to hide the real bid but
    // still make the required deposit. The same address can
    // place multiple bids.
    function bid(bytes32 _blindedBid) public payable onlyBefore(biddingEnd) {
        require(_blindedBid.length > 0);
        address _bidder = msg.sender;
        bids[_bidder].push(_blindedBid);
        deposits[_bidder] += msg.value;
        emit BidCreated(
            bids[_bidder][bids[_bidder].length - 1],
            deposits[_bidder],
            _bidder,
            msg.value
        );
    }

    // Reveal bids to verify bids that were sent by the user,
    // this will effectively allow the user to test if he/she has
    // the highest bid by verifying he actually sent it.
    // Bids has to be sent in order of bidding for reveal
    function reveal(
        uint256[] memory _values,
        bool[] memory _real,
        bytes32[] memory _secret
    ) public onlyAfter(biddingEnd) onlyBefore(revealEnd) {
        // every user can only reveal once
        for (uint256 i = 0; i < reveal_list.length; i++) {
            if (reveal_list[i] == msg.sender) {
                // revert if user has already revealed bids
                revert(
                    "User have already revealed bids - each user can only reveal once!"
                );
            }
        }
        uint256 length = bids[msg.sender].length;
        // require the number of values passed in to be equal to total number of bids made by user
        require(_values.length == length);
        require(_real.length == length);
        require(_secret.length == length);
        for (uint256 i = 0; i < length; i++) {
            bytes32 bidToCheck = bids[msg.sender][i];
            (uint256 value, bool real, bytes32 secret) = (
                _values[i],
                _real[i],
                _secret[i]
            );
            if (
                bidToCheck != keccak256(abi.encodePacked(value, real, secret))
            ) {
                // Bid was not actually revealed.
                // skip as the bid is invalid
                // note user can only reveal once
                // so invalid reveal will invalidate the particular bid
                continue;
            }
            if (real && deposits[msg.sender] >= value) {
                // if place bid function successful means bid is current highest bid
                // minus value off deposits as the value will be kept for current highest bid
                if (placeBid(msg.sender, value)) deposits[msg.sender] -= value;
            }
            // Make it impossible for the sender to re-claim
            // the same deposit.
            bids[msg.sender][i] = bytes32(0);
        }
        // return all deposits to user except deposit used for highest bid
        pendingReturns[msg.sender] += deposits[msg.sender];
        // reset deposit so sender cannot double claim
        deposits[msg.sender] = 0;
        // save sender as revealed already
        reveal_list.push(msg.sender);
        emit Reveal(
            pendingReturns[msg.sender],
            deposits[msg.sender],
            reveal_list[reveal_list.length - 1]
        );
    }

    // This is an "internal" function which means that it
    // can only be called from the contract itself (or from
    // derived contracts).
    // Used to place bid internally to check if bid 
    // will become highest bid
    function placeBid(address bidder, uint256 value)
        internal
        returns (bool success)
    {
        // if value not higher just return false
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != address(0)) {
            // Refund the previously highest bidder to pending return for withdrawal.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
        return true;
    }

    // End the auction and send the highest bid
    // to the DNS Manager
    // refund everyone's deposit using withdraw call
    function auctionEnd() public onlyAfter(revealEnd) returns (address) {
        require(!ended);
        // Call DNS contract to transfer the funds back and register the winner of auction
        Dns dns = Dns(dnsManagerAddress);
        dns.registerAddress.value(highestBid)(url, highestBidder);
        ended = true;
        emit AuctionEnded(highestBidder, highestBid, address(this).balance);
        // refund all excess Ether that the loser deposited
        for (uint256 i = 0; i < reveal_list.length; i++) {
            withdraw(address(uint160(address(reveal_list[i]))));
        }
        return highestBidder;
    }

    // Withdraw a bid that was overbid.
    // called when auction ends
    function withdraw(address payable _bidder)
        internal
        returns (uint256 amount)
    {
        require(ended);
        amount = pendingReturns[_bidder];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `transfer` returns
            pendingReturns[_bidder] = 0;
            _bidder.transfer(amount);
        }
        emit WithdrawEther(amount, _bidder);
        return amount;
    }
}
