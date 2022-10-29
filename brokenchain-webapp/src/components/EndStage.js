import React from "react";
import {
  auctionEnd,
  highestBidder,
  highestBid,
} from "../controller/auction_helpers.js";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DomainBiddingButton from "./DomainBiddingButton.js";
import Button from "react-bootstrap/Button";

class EndStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // States for inputs into reveal() function of BlindAuction contract
      highestBidderAddress: "",
      highestBidValue: "",
      clicked: false,
    };
  }

  endAuction = async () => {
    await auctionEnd(this.props.contractAddress);
  };

  showAlert = () => {
    window.alert(
      "Ending this auction... Please refresh the page once the Metamask Transaction is confirmed."
    );
  };

  componentDidMount() {
    const getHighestBidder = async () => {
      console.log("Entered component");
      let highestBidderAddress = await highestBidder(
        this.props.contractAddress
      );
      console.log("highestBidderAddress " + highestBidderAddress);
      let highestBidValue = await highestBid(this.props.contractAddress);
      console.log("highestBidValue " + highestBidValue);
      this.setState({
        highestBidderAddress: highestBidderAddress,
        highestBidValue: highestBidValue,
      });
    };
    getHighestBidder();
  }

  render() {
    const innerCardStyle = {
      fontFamily: "arial",
      padding: "15px",
      border: "1px solid #eee",
      boxShadow: "0 2px 3px #ccc",
      textAlign: "center",
    };

    let button = (
      <Button
        variant="outline-secondary"
        id="button-addon2"
        onClick={this.endAuction}
      >
        End Auction
      </Button>
    );

    if (this.state.clicked) {
      button = (
        <Button variant="outline-secondary" id="button-addon2" onClick={null}>
          Ending Auction...
        </Button>
      );
    }

    let winningText =
      "Waiting for new Ethereum blocks to be appended before showing winner information... please refresh the page and try again.";
    if (
      this.state.highestBidderAddress ===
      "0x0000000000000000000000000000000000000000"
    ) {
      winningText = `This auction had no bidders, and thus, no one won the auction.`;
    } else if (this.state.highestBidderAddress !== "") {
      winningText = `The winner of the bid is ${this.state.highestBidderAddress} with a bid of ${this.state.highestBidValue} ETH.`;
    }

    let endAuctionText = "";
    if (
      this.state.highestBidderAddress ===
      "0x0000000000000000000000000000000000000000"
    ) {
      endAuctionText = `Please click the "End Auction" button below.`;
    } else if (
      this.state.highestBidderAddress !== "" &&
      this.state.highestBidValue !== ""
    ) {
      endAuctionText = `If you are the winner, please click the "End Auction" button below to claim your domain ownership. Once the auction has ended, all ETH will be refunded to all participants that did not win the auction.`;
    }

    return (
      <div>
        <CardGroup>
          <Row xs={1} md={2} className="g-4">
            {/* <Col> */}
            <Card>
              <Card.Body>
                <Card.Title>How does the End Phase work?</Card.Title>
                <Card.Text>
                  The <b>End Phase</b> is where we can officially end an ongoing
                  auction. Auctions must end before winners can{" "}
                  <b>claim ownership</b> to their desired domains, and before{" "}
                  <b>refunds will be made</b> to users that did not win the
                  auction. If an auction has no bidders, the user that started
                  the auction will automatically be the winner the auction.
                  <br />
                  <b>Thank you for taking part in the DNS Blind Auction!</b>
                  <br />
                  Find out more about how the <b>End Phase</b> works and why it
                  is necessary{" "}
                  <a href="https://github.com/zhiqisim/Blind-Auction/blob/master/README.md#233-end-phase">
                    over here
                  </a>
                  !
                </Card.Text>
              </Card.Body>
            </Card>

            <div>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <p
                      style={{
                        margin: "auto",
                        fontSize: "18px",
                      }}
                    >
                      This auction is currently in the <b>End Stage</b>, as both
                      its Bidding and Reveal Stages have already concluded.
                      <br />
                      <br />
                      {winningText}
                      <br />
                      <br />
                      {endAuctionText}
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            {/* </Col> */}
          </Row>
        </CardGroup>
        <br />
        <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
          {" "}
          {button}
          <DomainBiddingButton />
        </div>
      </div>
    );
  }
}
export default EndStage;
