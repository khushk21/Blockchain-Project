import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {
    bid,
    biddingEnd,
} from "../controller/auction_helpers.js"

class BiddingStage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // States for inputs into bid() function of BlindAuction contract
            bidSend: '',
            bidInput: '',
            real: '',
            secret: '',

            // State for keeping track of remaining time
            remainingTime: '',
        };
    }

    // Handle Submiting of Bid from ExpiredHasAuction
    handleBidSend = event => {
        this.setState({
            bidSend: event.target.value,
        })
    }

    handleBid = event => {
        this.setState({
            bidInput: event.target.value,
        })
    }
    handleReal = event => {
        this.setState({
            real: event.target.value,
        })
    }
    handleSecret = event => {
        this.setState({
            secret: event.target.value,
        })
    }

    handlePlaceBid = async () => {
        let sendValue = this.state.bidSend;
        let value = this.state.bidInput;
        let real = null;
        if (this.state.real.toUpperCase() === 'TRUE') {
            real = true;
        } else if (this.state.real.toUpperCase() === 'FALSE') {
            real = false;
        } else {
            window.alert('Please either write "true" or "false" as your real input.')
            return;
        }

        let secret = this.state.secret;

        console.log("value: " + value);
        console.log("real: " + real);
        console.log("secret: " + secret);

        let contractAddress = this.props.contractAddress;
        console.log('before bid function')
        await bid(sendValue, value, real, secret, contractAddress);
        console.log('exits bid function')
    }

    async componentDidMount() {

        // Timer to show remaining time left for Bidding Stage
        let bidEndTime = await biddingEnd(this.props.contractAddress);

        setInterval(() => {
            this.setState({
                remainingTime: bidEndTime - (Math.floor(Date.now() / 1000))
            })
        }, 1000)
    }

    render() {

        const innerCardStyle = {
            fontFamily: "arial",
            padding: "15px",
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            textAlign: "center",
        }

        const cardStyle = {
            fontFamily: "arial",
            width: "80%",
            margin: "16px auto",
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            padding: "15px",
            textAlign: "center",
        };

        return (
            <div>
                <div style={cardStyle}>
                    <h2>
                        {
                            this.state.remainingTime === ''
                                ? 'Loading time left...'
                                : this.state.remainingTime < 0
                                    ? `Bidding Stage has concluded! Please refresh the page.`
                                    : this.state.remainingTime > 60
                                        ? `${Math.floor(this.state.remainingTime / 60)} min ${this.state.remainingTime - (Math.floor(this.state.remainingTime / 60)) * 60} sec`
                                        : `${this.state.remainingTime} sec`
                        }
                    </h2>

                </div>

                <div style={{
                    fontFamily: "arial",
                    width: "82%",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ ...innerCardStyle, flex: 1, marginRight: "16px" }}>
                        <h3>How do I participate in the <br />Bidding Phase?</h3>

                        <p>
                            The Bidding Phase allows a bidder (you!) to place bids for a particular domain name. While the Bidding Phase is ongoing, each user can place multiple bids of their choice, as "bid" inputs.
                            <br /><br />
                            Each bid takes in 4 values: <br /><br />A <b>deposit (in ether)</b>, a desired <b>bid</b>, a <b>'true/false' real boolean</b>, and finally a <b>secret</b>.
                            <br /><br />
                            Here are the steps to start a bid.
                            <br /><br />
                            1. Input in a <b>deposit</b> amount of your choice. Note that your desired bid amount does not need to correspond with your deposit amount. However, each individual bid value must be at least equal or greater than the sum of all your deposits.
                            <br /><br />2. Input your desired <b>bid</b>.
                            <br /><br />3. Indicate whether this bid is real or not by writing <b>'true'</b> or <b>'false'</b>. This way, you may input fake bids to mask your actual bid so that you can top up the ether deposits for your real bids.
                            <br /><br />4. Input a <b>secret password</b> value. The purpose of this secret is to authenticate that you are the one who made the bid. You must remember this secret, as it will be used in the reveal stage later to prove your identity for your bids.
                            <br /><br />
                            And you're done! All the above values will be hashed, and this hash will be sent to the Blind Auction Ethereum Smart Contract as inputs into the auction.

                            <br /><br />
                            <hr />
                            <br /><br />
                            <b>Important:</b> Please remember all your (bid, real, secret) inputs in chronological order, as you will need these values in the reveal stage later. Failure to properly safe-keep these values will result in you losing your bid.
                            <br /><br />
                            <hr />
                            <br /><br />
                            Find out more about how the <b>Bidding Phase</b> works and why it is necessary <a href="https://github.com/zhiqisim/Blind-Auction/blob/master/README.md#231-bidding-phase">over here</a>!
                        </p>
                    </div>

                    <div style={{ ...innerCardStyle, flex: 2, paddingTop: "80px" }} >
                        <p style={{ width: "100%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                            This auction is currently in the <b>Bidding Stage</b> and is still accepting bids!<br /><br />
                            Submit a bid below to participate in this auction.
                        </p>
                        <br />
                        <InputGroup className="col-8">
              <FormControl
                placeholder="Enter Deposit in ETH"
                aria-label="eth_deposit"
                aria-describedby="basic-addon2"
                onChange={this.handleBidSend}
              />
              <FormControl
                placeholder="Enter Desired Bid Value"
                aria-label="hash_value"
                aria-describedby="basic-addon2"
                onChange={this.handleBid}
              />
              <FormControl
                placeholder="Is this bid real? Write 'True' if real, and 'False' if fake."
                aria-label="bid_type"
                aria-describedby="basic-addon2"
                onChange={this.handleReal}
              />
              <FormControl
                placeholder="Enter your secret password"
                aria-label="secret"
                aria-describedby="basic-addon2"
                onChange={this.handleSecret}
              />
              <Button variant="outline-secondary" id="button-addon2" onClick={this.handlePlaceBid}>
                Place Bid
              </Button>
            </InputGroup>
                    </div>
                </div >
            </div >
        );
    }
}
export default BiddingStage;