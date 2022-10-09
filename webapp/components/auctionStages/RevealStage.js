import React from "react";

import {
    reveal,
    revealEnd,
} from "../../blindAuction";


const { soliditySha3, toWei, fromAscii } = require("web3-utils");


class RevealStage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // States for inputs into reveal() function of BlindAuction contract
            bids: '',
            reals: '',
            secrets: '',

            // State for keeping track of remaining time
            remainingTime: '',

        };
    }

    handleBids = event => {
        this.setState({
            bids: event.target.value,
        })
    }

    handleReals = event => {
        this.setState({
            reals: event.target.value,
        })
    }

    handleSecrets = event => {
        this.setState({
            secrets: event.target.value
        })
    }

    revealBids = async () => {

        // Convert strings of bids, reals, and secrets, into list form
        let bidsArray = this.state.bids.split(',');
        bidsArray = bidsArray.map(element => toWei(element.trim()));

        let realArray = this.state.reals.split(',');
        let error = false;
        realArray = realArray.map(element => {
            if (element.trim().toUpperCase() === 'TRUE') {
                return true;
            } else if (element.trim().toUpperCase() === 'FALSE') {
                return false;
            } else {
                window.alert('Please either write "true" or "false" as your real input.');
                error = true;
                return element;
            }
        });

        if (error) {
            return;
        }

        let secretsArray = this.state.secrets.split(',');
        secretsArray = secretsArray.map(element => fromAscii(element.trim()));

        console.log(bidsArray)
        console.log(realArray)
        console.log(secretsArray)

        await reveal(bidsArray, realArray, secretsArray, this.props.contractAddress);

    }

    async componentDidMount() {
        // Timer for remaining time left for Reveal Stage
        let revealEndTime = await revealEnd(this.props.contractAddress);

        setInterval(() => {
            this.setState({
                remainingTime: revealEndTime - (Math.floor(Date.now() / 1000))
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
                                    ? `Reveal Stage has concluded! Please refresh the page.`
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
                    flexDirection: "row"
                }}>

                    <div style={{ ...innerCardStyle, flex: 1, marginRight: "16px" }}>
                        <img style={{ width: "50px" }} src={require('../../assets/question.png')} />

                        <h3>How do I participate in the <br />Reveal Phase?</h3>
                        <p>

                            The Reveal Phase allows a bidder to reveal all their bids for a particular domain name, and prove that they were the ones who made those bids during the Bidding Phase.
                            <br /><br />
                            Unlike the Bidding Phase, the Reveal Phase only takes place once per bidder, and is executing for <b>ALL</b> bids made by a single bidder.
                            <br /><br />
                            The Reveal Phase takes in 3 inputs: <br /><br />A list of <b>bids</b>, a list of <b>'true/false'</b> real booleans, and a list of <b>secrets</b>.
                            <br /><br />
                            Here are the steps to reveal all your bids.
                            <br /><br />
                            1. Input in all your <b>bids</b> in <b>chronological order</b>, separating them each with a <b>comma ',' </b> .
                            <br /><br />2. Input in all your <b>'true/false'</b> real booleans in <b>chronological order</b>, separating them each with a <b>comma ',' </b> .
                            <br /><br />3. Input in all your <b>secrets</b> in <b>chronological order</b>, separating them each with a <b>comma ',' </b> .
                            <br /><br />
                            And you're <b>done</b>!
                            <br /><br />
                            <hr />
                            <br /><br />
                            <b>Important:</b>
                            <br /><br />
                            Each bidder can only reveal once! If a bidder attempts to reveal all their bids a second time, the contract call will not go through, and Metamask will return an contract revert error.
                            <br /><br />
                            Please input all your values in chronological order, separated by commas. This is to ensure that the contract will correctly read and verify your bids.
                            <br /><br />
                            <b>Example of Inputs:</b>
                            <br /><br />
                            If you made two bids (0.1, true, secret1), and (0.2, false, secret2), your inputs would be:<br /><br />
                            <b>List of Bids:</b> 0.1, 0.2<br />
                            <b>List of Real Booleans:</b> true, false<br />
                            <b>List of Secrets:</b> secret1, secret 2<br />

                            <br /><br />
                            <hr />
                            <br /><br />
                            Find out more about how the <b>Reveal Phase</b> works and why it is necessary <a href="https://github.com/zhiqisim/Blind-Auction/blob/master/README.md#232-reveal-phase">over here</a>!

                        </p>
                    </div>

                    <div style={{ ...innerCardStyle, flex: 2, paddingTop: "80px" }}>
                        <p style={{ width: "60%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                            This auction is currently in the <b>Reveal Stage</b>, as its Bidding Stage has already concluded.
                        <br /><br />Only participants that have bidded before will be allowed to participate to reveal their bids.
                        <br /><br />Reveal your bid below to be eligible to either win the auction or have your bids refunded due to a loss.
                    </p>
                        <br />

                        <b>Hash Values:</b><br />
                        <input
                            style={{ width: "70%", margin: "5px" }}
                            type="text"
                            placeholder="Enter all your bids in order, separated with a comma ','"
                            // value={this.state.bidValue}
                            onChange={this.handleBids}
                        /><br />
                        <input
                            style={{ width: "70%", margin: "5px" }}
                            type="text"
                            placeholder="Enter all your True/False values, separated with a comma ','"
                            // value={this.state.bidValue}
                            onChange={this.handleReals}
                        /><br />
                        <input
                            style={{ width: "70%", margin: "5px" }}
                            type="text"
                            placeholder="Enter all your secret passwords in order, separated with a comma ','"
                            // value={this.state.bidValue}
                            onChange={this.handleSecrets}
                        /><br />
                        <input style={{ margin: "5px" }} type="submit" value="Reveal" onClick={this.revealBids} />
                        {/* <br /><br /><b>Remaining Time Left for Reveal Stage:</b><br />
                    {this.state.remainingTime === ''
                        ? 'Loading time left...'
                        : this.state.remainingTime < 0
                            ? `Reveal Stage has concluded! Please refresh the page.`
                            : this.state.remainingTime > 60
                                ? `${Math.floor(this.state.remainingTime / 60)} min ${this.state.remainingTime - (Math.floor(this.state.remainingTime / 60)) * 60} sec`
                                : `${this.state.remainingTime} sec`} */}
                    </div>



                </div >

            </div>

        );
    }
}
export default RevealStage;