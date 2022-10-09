import React from "react";

import {
    bid,
    biddingEnd,
} from "../../blindAuction"

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
                    {/* <b>Remaining Time Left:</b><br /> */}
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
                        <img style={{ width: "50px" }} src={require('../../assets/question.png')} />
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

                            {/* - Tell user that they can place multiple bids
                            - eth of bid does not need to correpond with bid hash amount
                            --- as long as total bid is equal or greater than the highest bid put in, its ok
                            - can put fake bids to mask your real bid, indicate with 'true/false' boolean
                            - secret is to authenticate that you made the bid
                            --- must remember this secret, will need to be used in reveal stage later to prove your identity for your bids
                            - must remember ALL (bid, real, secret) instances, will need to be input into reveal stage later */}
                        </p>
                    </div>

                    <div style={{ ...innerCardStyle, flex: 2, paddingTop: "80px" }} >
                        <p style={{ width: "100%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                            This auction is currently in the <b>Bidding Stage</b> and is still accepting bids!<br /><br />
                            Submit a bid below to participate in this auction.
                        </p>
                        <br />
                        <b>ETH Deposit:</b>
                        <input
                            style={{ height: "50px", width: "80px", margin: "5px", fontSize: "30px" }}
                            type="text"
                            placeholder=""
                            // value={this.state.bidValue}
                            onChange={this.handleBidSend}
                        /><br /><br />
                        <b>Hash Values:</b><br />
                        <input
                            style={{ width: "40%", margin: "5px" }}
                            type="text"
                            placeholder="Enter your desired bid"
                            // value={this.state.bidValue}
                            onChange={this.handleBid}
                        /><br />
                        <input
                            style={{ width: "40%", margin: "5px" }}
                            type="text"
                            placeholder="Is this bid real? Write 'True' if real, and 'False' if fake. "
                            // value={this.state.bidValue}
                            onChange={this.handleReal}
                        /><br />
                        <input
                            style={{ width: "40%", margin: "5px" }}
                            type="text"
                            placeholder="Enter a secret password"
                            // value={this.state.bidValue}
                            onChange={this.handleSecret}
                        /><br />
                        <input style={{ margin: "5px" }} type="submit" value="Place Bid" onClick={this.handlePlaceBid} />
                        <br /><br />

                    </div>



                </div >
            </div >
        );
    }
}
export default BiddingStage;