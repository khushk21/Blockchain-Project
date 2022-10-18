import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "../components/Card";
import {lookupAddress} from "../controller/dns_backend.js"

class SearchDomain_ extends Component {
  constructor(props){
    super(props);
    this.state = {
      testDomainName: " string output yet",
            testAddress: "",

            // States for Entering Auction House
            domainName: "",

            // States for Looking Up Owner of Domain
            searchingDomainName: "no",
            lookedUpDomainName: "", // Dynamic two way binding domain name search
            searchedDomainName: "", // Only changes when "search" is pressed

            // States for Looking Up Domains for an Owner
            address: "0x0", // Dynamic two way binding eth address search
            searchedAddress: "", // Only changes when "search" is pressed
            domainNameOwner: "0x0000000000000000000000000000000000000000",
            domainsOwned: [],

            // States for Sending ETH to a Domain
            domainForETH: "",
            ethInput: 0,
            domainNotFound: false,

            mockItems: {
                "0x1": ["scse.ntu"],
                "0x2": ["mae.ntu"],
                "0x3": ["wkw.ntu", "nbs.ntu"],
                "0x4": ["stars.ntu"],
                "0x5": ["adm.ntu", "rep.ntu"],
            },

            data: { "Loading...": [] }

        };
  }
  handleSearchedDomainName = event => {
    this.setState({
        lookedUpDomainName: event.target.value
    })
}

handleDomainNameLookup = async () => {

this.setState({
    searchingDomainName: "yes",
    searchedDomainName: this.state.lookedUpDomainName,
})

let result = await lookupAddress(this.state.lookedUpDomainName);


this.setState({
    searchingDomainName: "display",
    domainNameOwner: result.ownerAddress,
})

console.log(this.state.domainNameOwner)


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
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <Button variant="outline-secondary" id="button-addon2" onClick={this.handleSearchedDomainName}>
                Search
              </Button>
            </InputGroup>
          </div>
          <Card test_text = "sometext" />
        </div>
      </>
    );
  }
}

export default SearchDomain_;
