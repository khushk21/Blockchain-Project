import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { reveal, revealEnd } from "../controller/auction_helpers.js";

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
                    The Reveal Phase allows a bidder to reveal all their bids
                    for a particular domain name, and prove that they were the
                    ones who made those bids during the Bidding Phase.
                    <br />
                    <br />
                    Unlike the Bidding Phase, the Reveal Phase only takes place
                    once per bidder, and is executing for <b>ALL</b> bids made
                    by a single bidder.
                    <br />
                    <br />
                    The Reveal Phase takes in 3 inputs: <br />
                    <br />A list of <b>bids</b>, a list of <b>'true/false'</b>{" "}
                    real booleans, and a list of <b>secrets</b>.
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
                    1. Input in all your <b>bids</b> in{" "}
                    <b>chronological order</b>, separating them each with a{" "}
                    <b>comma ',' </b> .
                    <br />
                    <br />
                    2. Input in all your <b>'true/false'</b> real booleans in{" "}
                    <b>chronological order</b>, separating them each with a{" "}
                    <b>comma ',' </b> .
                    <br />
                    <br />
                    3. Input in all your <b>secrets</b> in{" "}
                    <b>chronological order</b>, separating them each with a{" "}
                    <b>comma ',' </b> .
                    <br />
                    <br />
                    And you're <b>done</b>!
                    <br />
                    <br />
                    <hr />
                    <br />
                    <br />
                    <b>Important:</b>
                    <br />
                    <br />
                    Each bidder can only reveal once! If a bidder attempts to
                    reveal all their bids a second time, the contract call will
                    not go through, and Metamask will return an contract revert
                    error.
                    <br />
                    <br />
                    Please input all your values in chronological order,
                    separated by commas. This is to ensure that the contract
                    will correctly read and verify your bids.
                    <br />
                    <br />
                    <b>Example of Inputs:</b>
                    <br />
                    <br />
                    If you made two bids (0.1, true, secret1), and (0.2, false,
                    secret2), your inputs would be:
                    <br />
                    <br />
                    <b>List of Bids:</b> 0.1, 0.2
                    <br />
                    <b>List of Real Booleans:</b> true, false
                    <br />
                    <b>List of Secrets:</b> secret1, secret 2<br />
                    <br />
                    <br />
                    <hr />
                    <br />
                    <br />
                    Find out more about how the <b>Reveal Phase</b> works and
                    why it is necessary{" "}
                    <a href="https://github.com/zhiqisim/Blind-Auction/blob/master/README.md#232-reveal-phase">
                      over here
                    </a>
                    !
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </CardGroup>
        <div>
          <p
            style={{
              width: "60%",
              margin: "auto",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            Reveal your bid below to be eligible to either win the auction or
            have your bids refunded due to a loss.
          </p>
          <br />
          <InputGroup className="col-8">
            <FormControl
              placeholder="Enter all your bids in order, separated with a comma ','"
              aria-label="bid_values"
              aria-describedby="basic-addon2"
              onChange={this.handleBids}
            />
            <FormControl
              placeholder="Enter all your True/False values, separated with a comma ','"
              aria-label="bid_types"
              aria-describedby="basic-addon2"
              onChange={this.handleReals}
            />
            <FormControl
              placeholder="Enter all your secret passwords in order, separated with a comma ','"
              aria-label="secret_vals"
              aria-describedby="basic-addon2"
              onChange={this.handleSecrets}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={this.revealBids}
            >
              Reveal Results
            </Button>
          </InputGroup>
        </div>
      </div>
    );
  }
}
export default RevealStage;
