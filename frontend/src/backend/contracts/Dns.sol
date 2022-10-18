pragma solidity >0.4.23 <0.6.0;

import "./BlindAuction.sol";

contract Dns {
    struct AuctionItem {
        BlindAuction auction;
        address addr;
        uint256 bidding_end;
    }

    event Registration(
        address indexed _new_owner,
        string _url,
        uint256 _expiry_date
    );

    event AuctionStart(address _auction_addr, string _url);

    mapping(address => string[]) private reverse_lookup_table;
    address[] private address_list;
    mapping(address => bool) private address_not_unique;
    mapping(string => address) private dns_lookup_table;
    mapping(string => uint256) public expiry_date;
    address public owner;
    mapping(string => AuctionItem) private auctions;
    uint256 public expiry; // 15
    uint256 MAX_UINT = 16666666666666666666666666666666666666666666666666666666666666665;

    uint256 public bidding_length; // 10
    uint256 public reveal_length; // 5
    uint256 public grace_period;

    constructor(
        uint256 bid_len,
        uint256 reveal_len,
        uint256 exp,
        uint256 grace
    ) public {
        owner = msg.sender;
        // MAX_UINT = 2**256 - 1;
        bidding_length = bid_len;
        reveal_length = reveal_len;
        expiry = exp;
        grace_period = grace;
    }

    function getAddresses() public view returns (address[] memory) {
        return address_list;
    }

    function getURLCount(address addr) public view returns (uint256) {
        return reverse_lookup_table[addr].length;
    }

    function getURL(address addr, uint256 idx)
        public
        view
        returns (string memory)
    {
        return reverse_lookup_table[addr][idx];
    }

    function getRegisteredURL(string memory url) public view returns (address) {
        return dns_lookup_table[url];
    }

    function checkExpired(string memory url) public view returns (bool) {
        return (now >= expiry_date[url]);
    }

    function getExpired(string memory url) public view returns (uint256) {
        return expiry_date[url];
    }

    function startAuction(string memory url) public {
        if (!checkExpired(url)) {
            revert("URL not yet expired!");
        }

        if (!checkAuctionEnded(url)) {
            if (!checkAuctionPastGrace(url)) {
                revert("Existing auction not yet ended!");
            }
        }

        AuctionItem memory new_auction;
        // Init new auction here
        new_auction.auction = createAuction(url);
        new_auction.addr = address(new_auction.auction);
        new_auction.bidding_end = new_auction.auction.biddingEnd();
        auctions[url] = new_auction;
        emit AuctionStart(new_auction.addr, url);
    }

    function createAuction(string memory url) private returns (BlindAuction) {
        BlindAuction auction = new BlindAuction(
            bidding_length,
            reveal_length,
            url,
            address(uint160(address(this))),
            msg.sender
        );
        return auction;
    }

    function checkAuctionEnded(string memory url) public view returns (bool) {
        if (auctions[url].addr == address(0)) {
            return true;
        }
        return auctions[url].auction.ended();
    }

    function checkAuctionPastGrace(string memory url)
        public
        view
        returns (bool)
    {
        uint256 revealtimer = auctions[url].auction.revealEnd();
        if (now > revealtimer + grace_period) {
            return true;
        }
        return false;
    }

    function getAuctionURL(string memory url) public view returns (address) {
        AuctionItem memory auc = auctions[url];
        // Check if registration has expired
        if (!checkExpired(url)) {
            // url registration not yet expired
            return address(0);
        }

        if (checkAuctionEnded(url)) {
            return address(0);
        }

        return auc.addr;
    }

    function internalAddressRegister(string memory url, address new_owner)
        internal
    {
        // If previously registered
        if (dns_lookup_table[url] != address(0)) {
            address prev_owner = dns_lookup_table[url];
            uint256 url_num = getURLCount(prev_owner);
            uint256 idx = MAX_UINT;

            // look for index in reverese table that corresponds to the url
            for (uint256 i = 0; i < url_num; i++) {
                // Because solidity can't compare strings, need convoluted method
                if (
                    keccak256(bytes(reverse_lookup_table[prev_owner][i])) ==
                    keccak256(bytes(url))
                ) {
                    idx = i;
                    break;
                }
            }

            // Check that a url was matched
            assert(idx != MAX_UINT);

            // If previous owner is the only url for that address
            if (idx == 0) {
                // find and remove previous owner in address list
                for (uint256 j = 0; j < address_list.length; j++) {
                    if (address_list[j] == prev_owner) {
                        address_list[j] = address_list[address_list.length - 1];
                        address_list.pop();
                        address_not_unique[prev_owner] = false;
                        break;
                    }
                }
            }

            // move the last url to the position to be deleted
            reverse_lookup_table[prev_owner][idx] = reverse_lookup_table[prev_owner][reverse_lookup_table[prev_owner]
                .length - 1];
            // remove last element
            reverse_lookup_table[prev_owner].pop();
        }

        // Add new owner into the reverse lookup table
        reverse_lookup_table[new_owner].push(url);
        // Update DNS routing table
        dns_lookup_table[url] = new_owner;
        // Change expiry date
        expiry_date[url] = now + expiry;

        // Add addr to address list if new addr
        if (!address_not_unique[new_owner]) {
            address_list.push(new_owner);
            address_not_unique[new_owner] = true;
        }
    }

    function registerAddress(string memory url, address addr) public payable {
        address auc_addr = msg.sender;
        // Check if url is expired
        if (checkExpired(url)) {
            // Check if calling auction address is valid
            require(auctions[url].addr == auc_addr);
            if (addr != address(0)) {
                internalAddressRegister(url, addr);
                emit Registration(addr, url, expiry_date[url]);
            }
        }
    }
}
