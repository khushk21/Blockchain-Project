import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { bid, biddingEnd } from "../controller/auction_helpers.js";
import DomainBiddingButton from "./DomainBiddingButton.js";

class BiddingStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // States for inputs into bid() function of BlindAuction contract
      bidSend: "",
      bidInput: "",
      real: "",
      secret: "",

      // State for keeping track of remaining time
      remainingTime: "",
    };
  }

  // Handle Submiting of Bid from ExpiredHasAuction
  handleBidSend = (event) => {
    this.setState({
      bidSend: event.target.value,
    });
  };

  handleBid = (event) => {
    this.setState({
      bidInput: event.target.value,
    });
  };
  handleReal = (event) => {
    this.setState({
      real: event.target.value,
    });
  };
  handleSecret = (event) => {
    this.setState({
      secret: event.target.value,
    });
  };

  handlePlaceBid = async () => {
    let sendValue = this.state.bidSend;
    let value = this.state.bidInput;
    let real = null;
    if (this.state.real.toUpperCase() === "TRUE") {
      real = true;
    } else if (this.state.real.toUpperCase() === "FALSE") {
      real = false;
    } else {
      window.alert('Please either write "true" or "false" as your real input.');
      return;
    }

    let secret = this.state.secret;

    console.log("value: " + value);
    console.log("real: " + real);
    console.log("secret: " + secret);

    let contractAddress = this.props.contractAddress;
    console.log("before bid function");
    await bid(sendValue, value, real, secret, contractAddress);
    console.log("exits bid function");
  };

  async componentDidMount() {
    // Timer to show remaining time left for Bidding Stage
    let bidEndTime = await biddingEnd(this.props.contractAddress);

    setInterval(() => {
      this.setState({
        remainingTime: bidEndTime - Math.floor(Date.now() / 1000),
      });
    }, 1000);
  }

  render() {
    const innerCardStyle = {
      fontFamily: "arial",
      padding: "15px",
      border: "1px solid #eee",
      boxShadow: "0 2px 3px #ccc",
      textAlign: "center",
    };

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
        <CardGroup>
          <Row xs={1} md={2} className="g-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Time Left</Card.Title>
                  <Card.Text>
                    {this.state.remainingTime === ""
                      ? "Loading time left..."
                      : this.state.remainingTime < 0
                      ? `Bidding Stage has concluded! Please refresh the page.`
                      : this.state.remainingTime > 60
                      ? `${Math.floor(this.state.remainingTime / 60)} min ${
                          this.state.remainingTime -
                          Math.floor(this.state.remainingTime / 60) * 60
                        } sec`
                      : `${this.state.remainingTime} sec`}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>
                    How to participate in the bidding phase?
                  </Card.Title>
                  <Card.Text>
                    A bidder (you!) has the opportunity to submit an offer
                    during the bidding round for a certain domain name. Each
                    user may submit a number of bids of their choosing as "bid"
                    inputs at any time during the Bidding Phase.
                    <br />
                    <br />
                    Each bid takes in 4 values: <br />
                    <br />A <b>deposit (in ether)</b>, a desired <b>bid</b>, a{" "}
                    <b>'true/false' real boolean</b>, and finally a{" "}
                    <b>secret</b>.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title> Here are the steps to start a bid:</Card.Title>
                  <Card.Text>
                    1. Enter the amount you want to use as your <b>deposit</b>.
                    Note that it is not necessary for your desired bid amount to
                    match with the sum of your deposit. However, the value of
                    each individual bid must be less than the ETH deposit for
                    that bid and if you are submitting multiple bids then sum of
                    all your ETH deposits should be grater than the sum of all
                    your true bid values.
                    <br />
                    2. Enter a value for your desired <b>bid</b>.
                    <br />
                    3. Indicate whether this bid is real or not by writing{" "}
                    <b>'true'</b> or <b>'false'</b>. This way, you may input
                    fake bids to mask your actual bid so that you can top up the
                    ether deposits for your real bids.
                    <br />
                    4. Enter a value for the <b>secret password</b>. The
                    objective of this the key is to prove that you are the one
                    who made the purchase bid. This information must be kept in
                    mind because it will be used in the subsequent disclosure
                    step to validate your identity for bidding.
                    <br />
                    You're done now! All of the aforementioned values will be
                    hashed, and the resulting hash will be provided to the
                    Ethereum Smart Contract for the Blind Auction as inputs for
                    the auction.
                    <br />
                    <b>Important:</b> You will need these values in the reveal
                    stage, so please keep track of all your (bid, real, secret)
                    inputs in the order they were entered. You will lose your
                    bid if these values are not properly stored.
                    <br /> Find out more about how the <b>Bidding Phase</b>{" "}
                    works and why it is necessary{" "}
                    <a href="https://github.com/khushk21/Blockchain-Project/blob/main/README.md#231-bidding-phase">
                      over here
                    </a>
                    !
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <div>
              <Card style={{ width: "90%" }}>
                <Card.Body>
                  <Card.Text>
                    <p
                      style={{
                        width: "100%",
                        margin: "auto",
                        fontSize: "18px",
                      }}
                    >
                      This auction is currently in the <b>Bidding Stage</b> and
                      is still accepting bids!
                      <br />
                      Submit a bid below to participate in this auction.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
              <br />

              <FormControl
                placeholder="Enter Deposit in ETH"
                aria-label="eth_deposit"
                aria-describedby="basic-addon2"
                onChange={this.handleBidSend}
                style={{ width: "90%" }}
              />
              <br />
              <FormControl
                placeholder="Enter Desired Bid Value"
                aria-label="hash_value"
                aria-describedby="basic-addon2"
                onChange={this.handleBid}
                style={{ width: "90%" }}
              />
              <br />
              <FormControl
                placeholder="Is this bid real? Write 'True' if real, and 'False' if fake."
                aria-label="bid_type"
                aria-describedby="basic-addon2"
                onChange={this.handleReal}
                style={{ width: "90%" }}
              />
              <br />
              <FormControl
                placeholder="Enter your secret password"
                aria-label="secret"
                aria-describedby="basic-addon2"
                onChange={this.handleSecret}
                style={{ width: "90%" }}
              />
              <br />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={this.handlePlaceBid}
              >
                Place Bid
              </Button>
              <DomainBiddingButton />
            </div>
          </Row>
        </CardGroup>
      </div>
    );
  }
}
export default BiddingStage;
