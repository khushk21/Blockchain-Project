import React from "react";

import {
    startAuction,
    getAuctionURL,
} from "../dns.js"

class ExpiredNoAuction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false

        };
    }

    // Handles the Starting of Auction 
    handleStartAuction = async () => {
        // Starts a new Auction
        this.setState({
            clicked: true
        })
        await startAuction(this.props.domainName);
    }

    showAlert = () => {
        window.alert('A new auction is currently being created. Please refresh the page once the Metamask Transaction is confirmed.')
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

        let button = null;

        if (!this.state.clicked) {
            button = <input style={{ margin: "5px" }} type="submit" value="Start Auction" onClick={this.handleStartAuction} />

        } else {
            button = <input style={{ margin: "5px" }} type="submit" value="Starting Auction..." onClick={this.showAlert} />

        }

        return (
            <div style={cardStyle}>
                <img style={{ width: "100px" }} src={require('../assets/checked.png')} />

                <h1 >{this.props.domainName} is available for Auction!</h1>
                <p style={{ width: "60%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                    <b>Great news!</b><br /><br />This domain name is currently not owned by anyone in the Ethereum Network, and is thus available for auction.
                    <br /><br />
                    Click below to start an auction for this domain name.
                </p>
                <br />
                <br />
                {button}

            </div>
        );
    }
}

export default ExpiredNoAuction;