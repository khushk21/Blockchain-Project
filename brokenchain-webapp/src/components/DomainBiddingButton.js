import React from "react";
import { Button } from "react-bootstrap";

class DomainBiddingButton_ extends React.Component {
  handleBack = () => {
    this.props.history.push("/domain_bidding");
  };

  handleDoubleBack = () => {
    this.props.history.push("/");
  };
  render() {
    return (
      <div>
        <br />
        <a href="/domain_bidding">
          <Button variant="secondary" id="button-addon2">
            Back to Domain Bidding
          </Button>
        </a>
        <br />
        <br />
        <a href="/">
          <Button variant="secondary" id="button-addon2">
            Back to Home
          </Button>
        </a>
      </div>
    );
  }
}
export default DomainBiddingButton_;
