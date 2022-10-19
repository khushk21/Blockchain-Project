import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {lookupAddress, sendETH} from "../controller/dns_backend.js"

class PayDomain_ extends Component {
  constructor(props){
    super(props);
    this.state = {
            // States for Sending ETH to a Domain
            domainForETH: "",
            ethInput: 0,
            domainNotFound: false,
        };
  }
 // Handlers for Sending ETH to a Domain

 handleDomainNameETH = event => {
    this.setState({
        domainForETH: event.target.value
    })
}

handleETHInput = (e) => {
    this.setState({ ethInput: e.target.value });
};

sendETHtoURL = async () => {
    // Check if domain has an owner
    let result = await lookupAddress(this.state.domainForETH);

    if (result.ownerAddress === "0x0000000000000000000000000000000000000000") {
        window.alert("This domain is not owned by an ETH address!");
    } else {
        sendETH(this.state.ethInput, result.ownerAddress);
    }

    // // For testing purposes only
    // sendETH(this.state.ethInput, this.state.domainForETH);
}

  render() {
    return (
      <>
        <div class="container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20vh",
            }}
          >
            <InputGroup className="col-8">
              <FormControl
                placeholder="Amount in ETH"
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={this.handleETHInput}
              />
              <FormControl
                placeholder="Domain Name"
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={this.handleDomainNameETH}
              />
              <Button variant="outline-secondary" id="button-addon2" onClick={this.sendETHtoURL}>
                Send
              </Button>
            </InputGroup>
          </div>
        </div>
      </>
    );
  }
}

export default PayDomain_;
