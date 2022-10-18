import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

class Navbar_ extends Component {
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Decentralized Domain Registrar</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/search_domain">Search Domain</Nav.Link>
            <Nav.Link href="/domain_bidding">Domain Bidding</Nav.Link>
            <Nav.Link href="/pay_domain">Pay Domain</Nav.Link>
          </Nav>
        </Navbar>
      </>
    );
  }
}

export default Navbar_;
