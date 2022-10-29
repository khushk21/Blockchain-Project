import React from "react";
import { Button } from "react-bootstrap";

class DomainBiddingButton_ extends React.Component {
  handleBack = () => {
    this.props.history.goBack();
  };

  handleDoubleBack = () => {
    this.props.history.goBack();
    this.props.history.goBack();
  };
  render() {
    return (
      <div>
        <br />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={this.handleBack}
        >
          Back to Domain Bidding
        </Button>
        <br />
        <br />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={this.handleDoubleBack}
        >
          Back to Home
        </Button>
      </div>
    );
  }
}
export default DomainBiddingButton_;
