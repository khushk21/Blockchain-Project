import React from "react";
import Card from "react-bootstrap/Card";
import DomainBiddingButton from "./DomainBiddingButton.js";
import { getExpired } from "../controller/dns_backend.js";

class NotExpired extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // State for keeping track of remaining time
      expiryEndTime: "",
    };
  }

  async componentDidMount() {
    // Timer for remaining time left for Reveal Stage
    let expiryEndTime = await getExpired(this.props.domainName);

    setInterval(() => {
      this.setState({
        expiryEndTime: expiryEndTime - Math.floor(Date.now() / 1000),
      });
    }, 1000);
  }

  render() {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <Card style={{ width: "35%", margin: "auto", textAlign: "center" }}>
            <Card.Body>
              <Card.Title>
                {this.props.domainName} has not yet expired
              </Card.Title>
              <Card.Subtitle>
                {" "}
                Unfortunately, this domain name is still currently owned by
                someone in the Ethereum Network, and has not yet expired. Thus,
                the domain name is not available for auction.
                <br />
                <br />
                Please check back again next time!
                <br />
                <br />
                <b>Time left before domain expires:</b>
                <br />
                {this.state.expiryEndTime === ""
                  ? "Loading time left..."
                  : this.state.expiryEndTime < 0
                  ? `Domain has expired! Please refresh the page.`
                  : this.state.expiryEndTime > 60
                  ? `${Math.floor(this.state.expiryEndTime / 60)} min ${
                      this.state.expiryEndTime -
                      Math.floor(this.state.expiryEndTime / 60) * 60
                    } sec`
                  : `${this.state.expiryEndTime} sec`}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </div>
        <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
          <DomainBiddingButton />
        </div>
      </>
    );
  }
}

export default NotExpired;
