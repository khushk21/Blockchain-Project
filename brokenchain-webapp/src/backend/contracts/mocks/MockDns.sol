pragma solidity >0.4.23 <0.6.0;
import "../Dns.sol";

contract MockDns is Dns {
    constructor(
        uint256 bidding_len,
        uint256 reveal_len,
        uint256 exp,
        uint256 grace
    ) public Dns(bidding_len, reveal_len, exp, grace) {}

    function testFuncParam(int256 input_int) public pure returns (int256) {
        return input_int;
    }

    function testFunc() public pure returns (string memory) {
        return ("teststring.ntu");
    }

    function testRegisterFunc(string memory url, address addr) public {
        if (checkExpired(url)) {
            internalAddressRegister(url, addr);
            emit Registration(addr, url, expiry_date[url]);
        } else {
            emit Registration(address(0), "not expired", 0);
        }
    }
}
