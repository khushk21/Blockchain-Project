import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { reveal, revealEnd } from "../controller/auction_helpers.js";
import DomainBiddingButton from "./DomainBiddingButton.js";

const { toWei, fromAscii } = require("web3-utils");

class RevealStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // States for inputs into reveal() function of BlindAuction contract
      bids: "",
      reals: "",
      secrets: "",

      // State for keeping track of remaining time
      remainingTime: "",
    };
  }

  handleBids = (event) => {
    this.setState({
      bids: event.target.value,
    });
  };

  handleReals = (event) => {
    this.setState({
      reals: event.target.value,
    });
  };

  handleSecrets = (event) => {
    this.setState({
      secrets: event.target.value,
    });
  };

  revealBids = async () => {
    // Convert strings of bids, reals, and secrets, into list form
    let bidsArray = this.state.bids.split(",");
    bidsArray = bidsArray.map((element) => toWei(element.trim()));

    let realArray = this.state.reals.split(",");
    let error = false;
    realArray = realArray.map((element) => {
      if (element.trim().toUpperCase() === "TRUE") {
        return true;
      } else if (element.trim().toUpperCase() === "FALSE") {
        return false;
      } else {
        window.alert(
          'Please either write "true" or "false" as your real input.'
        );
        error = true;
        return element;
      }
    });

    if (error) {
      return;
    }

    let secretsArray = this.state.secrets.split(",");
    secretsArray = secretsArray.map((element) => fromAscii(element.trim()));

    console.log(bidsArray);
    console.log(realArray);
    console.log(secretsArray);

    await reveal(
      bidsArray,
      realArray,
      secretsArray,
      this.props.contractAddress
    );
  };

  async componentDidMount() {
    // Timer for remaining time left for Reveal Stage
    let revealEndTime = await revealEnd(this.props.contractAddress);

    setInterval(() => {
      this.setState({
        remainingTime: revealEndTime - Math.floor(Date.now() / 1000),
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
                      ? `Reveal Stage has concluded! Please refresh the page.`
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
                    How to participate in the Reveal Phase?
                  </Card.Title>
                  <Card.Text>
                    Unfortunately, this domain name has not yet expired and is
                    still being used by someone in the Ethereum Network. As a
                    result, the domain name is not up for sale.
                    <br />
                    Unlike the Bidding Phase, the Reveal Phase only takes place
                    once per bidder, and is executing for <b>ALL</b> bids made
                    by a single bidder.
                    <br />
                    The Reveal Phase takes in 3 inputs: <br />A list of{" "}
                    <b>bids</b>, a list of <b>'true/false'</b> real booleans,
                    and a list of <b>secrets</b>.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {" "}
                    Here are the steps to reveal all your bids:
                  </Card.Title>
                  <Card.Text>
                    1. Enter all your <b>bids</b> in <b>chronological order</b>,
                    separating them each with a <b>comma ',' </b> .
                    <br />
                    2. Enter all your <b>'true/false'</b> real booleans in{" "}
                    <b>chronological order</b>, separating them each with a{" "}
                    <b>comma ',' </b> .
                    <br />
                    3. Enter all your <b>secrets</b> in{" "}
                    <b>chronological order</b>, separating them each with a{" "}
                    <b>comma ',' </b> .
                    <br />
                    And you're <b>done</b>!
                    <br />
                    <b>Important:</b>
                    <br />
                    There can only be one revelation per bidder! In the event
                    that a bidder makes a second effort to reveal all of their
                    offers, the contract call will fail and Metamask will
                    provide a contract revert error.
                    <br />
                    Please enter all of your values between commas and in
                    chronological sequence. This is to guarantee that your
                    proposals will be accurately interpreted and verified by the
                    contract.
                    <br />
                    <b>Example of Inputs:</b>
                    <br />
                    If you made two bids (0.1, true, secret1), and (0.2, false,
                    secret2), your inputs would be:
                    <br />
                    <b>List of Bids:</b> 0.1, 0.2
                    <br />
                    <b>List of Real Booleans:</b> true, false
                    <br />
                    <b>List of Secrets:</b> secret1, secret 2<br />
                    <br />
                    Find out more about how the <b>Reveal Phase</b> works and
                    why it is necessary{" "}
                    <a href="https://github.com/khushk21/Blockchain-Project/blob/main/README.md#232-reveal-phase">
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
                        margin: "auto",
                        fontSize: "18px",
                      }}
                    >
                      To be eligible to win the auction or have your bids
                      reimbursed if you lose, please reveal your bid below.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
              <br />

              <FormControl
                placeholder="Enter all your bids in order, separated with a comma ','"
                aria-label="bid_values"
                aria-describedby="basic-addon2"
                onChange={this.handleBids}
                style={{ width: "90%" }}
              />
              <br />
              <FormControl
                placeholder="Enter all your True/False values, separated with a comma ','"
                aria-label="bid_types"
                aria-describedby="basic-addon2"
                onChange={this.handleReals}
                style={{ width: "90%" }}
              />
              <br />
              <FormControl
                placeholder="Enter all your secret passwords in order, separated with a comma ','"
                aria-label="secret_vals"
                aria-describedby="basic-addon2"
                onChange={this.handleSecrets}
                style={{ width: "90%" }}
              />
              <br />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={this.revealBids}
              >
                Reveal Results
              </Button>
              <DomainBiddingButton />
            </div>
          </Row>
        </CardGroup>
      </div>
    );
  }
}
export default RevealStage;
