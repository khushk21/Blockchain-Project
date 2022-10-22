import React, { Component } from "react";
import Card from "react-bootstrap/Card";


class Card_ extends Component {
constructor(props){
  super(props);
  this.state = {
    domainOwner : this.props.props.domainOwner,
    searchedAddress: this.props.props.searchedAddress
  }
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
          <Card style={{ width: "50rem" }}>
            <Card.Body>
              <Card.Title>Domain Name:</Card.Title>
              <Card.Subtitle>{this.props.props.searchedAddress}</Card.Subtitle>
              {this.props.props.searchedAddress? <div><Card.Title>Domain Owner</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
              {this.props.props.domainOwner === "0x0000000000000000000000000000000000000000"? "This Domain is not owned by any account": this.props.props.domainOwner}
              </Card.Subtitle></div> : null}
              
              <Card.Text>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default Card_;
