import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

class Navbar_ extends Component {
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">BrokenChain Decentralized Domain Registrar</Navbar.Brand>
          <Nav className="justify-content-end" style={{width:"75%"}}>
            <Nav.Link href="/about">About Us</Nav.Link>
            <Nav.Link href="/search_domain">Search Domain Owner</Nav.Link>
            <Nav.Link href="/domain_bidding">Domain Bidding</Nav.Link>
            <Nav.Link href="/pay_domain">Pay Domain</Nav.Link>
          </Nav>
        </Navbar>
      </>
    );
  }
}

export default Navbar_;
