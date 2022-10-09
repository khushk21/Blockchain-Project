import React from "react";

import {
    startAuction,
} from "../dns.js"

import {
    biddingEnd,
    revealEnd,
} from "../blindAuction";

import BiddingStage from './auctionStages/BiddingStage';
import RevealStage from './auctionStages/RevealStage';
import EndStage from './auctionStages/EndStage';

class ExpiredHasAuction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // States for handling stage check:
            stage: 0,
            curTime: '',
        };
    }

    componentDidMount() {
        const stageCheck = async () => {
            console.log('before bidEndTime')
            let bidEndTime = await biddingEnd(this.props.contractAddress);
            console.log('after bidEndTime')

            console.log("bidEndTime: " + bidEndTime)
            let revealEndTime = await revealEnd(this.props.contractAddress);
            console.log("revealEndTime: " + revealEndTime)

            let timeNow = Math.floor(Date.now() / 1000);
            console.log("timeNow: " + timeNow)

            if (timeNow <= bidEndTime) {
                this.setState({
                    stage: 1 // 1 
                })
            } else if (timeNow > bidEndTime && timeNow <= revealEndTime) {
                this.setState({
                    stage: 2 // 2
                })
            } else {
                this.setState({
                    stage: 3 // 3
                })
            }
        }

        stageCheck();
    }

    render() {

        const cardStyle = {
            fontFamily: "arial",
            width: "80%",
            margin: "16px auto",
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            padding: "15px",
            textAlign: "center",
        };


        let stage = "";
        switch (this.state.stage) {
            case 1:
                stage = <BiddingStage contractAddress={this.props.contractAddress} />;
                break;
            case 2:
                stage = <RevealStage contractAddress={this.props.contractAddress} />;
                break;
            case 3:
                stage = <EndStage contractAddress={this.props.contractAddress} />;
                break;

        }

        return (
            <div >
                <div style={cardStyle}>
                    <img style={{ width: "100px" }} src={require('../assets/checked.png')} />
                    <h1 >{this.props.domainName} has an existing ongoing auction!<br /> </h1>
                    <h1>{this.state.stage === 0 ? "Loading Auction Stage..." : this.state.stage === 1 ? "Bidding Phase" : this.state.stage === 2 ? "Reveal Phase" : this.state.stage === 3 ? "End Phase" : ""
                    }</h1>
                </div>
                <div>
                    {stage}
                </div>

            </div>

        );
    }
}

export default ExpiredHasAuction;