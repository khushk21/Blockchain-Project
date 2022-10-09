import React from "react";

import {
    getExpired
} from "../dns";

class NotExpired extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // State for keeping track of remaining time
            expiryEndTime: '',

        };
    }

    async componentDidMount() {
        // Timer for remaining time left for Reveal Stage
        let expiryEndTime = await getExpired(this.props.domainName);

        setInterval(() => {
            this.setState({
                expiryEndTime: expiryEndTime - (Math.floor(Date.now() / 1000))
            })
        }, 1000)
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

        return (
            <div style={cardStyle}>
                <img style={{ width: "100px" }} src={require('../assets/cancel.png')} />

                <h1 >{this.props.domainName} has not yet expired</h1>
                <p style={{ width: "45%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                    Unfortunately, this domain name is still currently owned by someone in the Ethereum Network, and has not yet expired. Thus, the domain name is not available for auction.
                    <br /><br />
                    Please check back again next time!

                    <br /><br /><b>Time left before domain expires:</b><br />
                    {this.state.expiryEndTime === ''
                        ? 'Loading time left...'
                        : this.state.expiryEndTime < 0
                            ? `Domain has expired! Please refresh the page.`
                            : this.state.expiryEndTime > 60
                                ? `${Math.floor(this.state.expiryEndTime / 60)} min ${this.state.expiryEndTime - (Math.floor(this.state.expiryEndTime / 60)) * 60} sec`
                                : `${this.state.expiryEndTime} sec`}
                </p>

            </div>
        );
    }
}

export default NotExpired;