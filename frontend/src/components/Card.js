import React, { Component } from "react";
import Card from "react-bootstrap/Card";


class Card_ extends Component {
constructor(props){
  super(props);
  this.state = {
    domainOwner : this.props.props.domainOwner
  }
}
  render() {
    {console.log("domain", this.state.domainOwner)}
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
              <Card.Title>Domain Owner:</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
              {this.props.props.domainOwner}
              </Card.Subtitle>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.

              </Card.Text>
              <Card.Link href="#">Card Link</Card.Link>
              <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default Card_;
