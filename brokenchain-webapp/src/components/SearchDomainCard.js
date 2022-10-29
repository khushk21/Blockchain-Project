import React, { Component } from "react";
import Card from "react-bootstrap/Card";


class Card_ extends Component {
constructor(props){
  super(props);
  this.state = {
    domainOwner : this.props.props.domainOwner,
    domainsOwned: this.props.props.domainsOwned
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
                <Card.Title>Domain Owner:</Card.Title>
                <Card.Subtitle>{this.props.props.domainOwner}</Card.Subtitle>
                {this.props.props.domainsOwned.length? <Card.Title>Domains Owned</Card.Title> : null}
                {this.props.props.domainsOwned.map(function(object, i){
                    return <Card.Subtitle key={i}>{object}</Card.Subtitle>
                })}      
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default Card_;
