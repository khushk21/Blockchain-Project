import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class Home_ extends Component {
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
              <Card.Text>
                A decentralized domain registrar, in contrast, is open,
                transparent, fair and decentralized. The price for registration
                of a domain is determined by a “sealed-auction” during which
                anyone can bid and counterbid for a domain. The process is all
                transparent as smart contracts on the blockchain, and no central
                authority or commercial company controls the selling and
                registration of new domains
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default Home_;
