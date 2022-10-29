import React from "react";
import Card from "react-bootstrap/Card";

import { biddingEnd, revealEnd } from "../controller/auction_helpers.js";

import BiddingStage from "../components/BiddingStage.js";
import RevealStage from "../components/RevealStage";
import EndStage from "../components/EndStage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class ExpiredHasAuction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // States for handling stage check:
      stage: 0,
      curTime: "",
    };
  }

  componentDidMount() {
    const stageCheck = async () => {
      console.log("before bidEndTime");
      let bidEndTime = await biddingEnd(this.props.contractAddress);
      console.log("after bidEndTime");

      console.log("bidEndTime: " + bidEndTime);
      let revealEndTime = await revealEnd(this.props.contractAddress);
      console.log("revealEndTime: " + revealEndTime);

      let timeNow = Math.floor(Date.now() / 1000);
      console.log("timeNow: " + timeNow);

      if (timeNow <= bidEndTime) {
        this.setState({
          stage: 1, // 1
        });
      } else if (timeNow > bidEndTime && timeNow <= revealEndTime) {
        this.setState({
          stage: 2, // 2
        });
      } else {
        this.setState({
          stage: 3, // 3
        });
      }
    };

    stageCheck();
  }

  render() {
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
      default:
        console.log("hello");
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col>
          <Card style={{ width: "25%", margin: "auto", textAlign: "center" }}>
            <Card.Body>
              <Card.Title>
                {this.props.domainName} has an existing ongoing auction!
                <br />
              </Card.Title>
              <Card.Subtitle>
                {" "}
                {this.state.stage === 0
                  ? "Loading Auction Stage..."
                  : this.state.stage === 1
                  ? "Bidding Phase"
                  : this.state.stage === 2
                  ? "Reveal Phase"
                  : this.state.stage === 3
                  ? "End Phase"
                  : ""}
                <br />
                <br />
              </Card.Subtitle>
            </Card.Body>
          </Card>
          <br /> <br />
          <Row>{stage}</Row>
        </Col>
      </div>
    );
  }
}

export default ExpiredHasAuction;
