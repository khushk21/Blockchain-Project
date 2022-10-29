import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {getURL, getURLCount} from "../controller/dns_backend.js"

import Card from "../components/SearchDomainCard"

class DomainList_ extends Component {
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
  // Handlers for Look-up of Domains of an Owner

  handlePublicAddress = event => {
    this.setState({
        address: event.target.value
    })
}

handleOwnerLookup = async () => {

        let addressToCountMap = {}
        let output = await getURLCount(this.state.address);
        addressToCountMap[this.state.address] = await output.count
        let mappings = {}

        for (const [key, value] of Object.entries(addressToCountMap)) {
            let domainList = []

            // Based on its count value, we iteratively obtain the domain URL
            // corresponding its index, for a given ethereum address
            for (var i = 0; i < value; i++) {
                let output = await getURL(key, i);
                domainList.push(output.domainName);
            }
            // Add the eth address to domain list mapping to the mappings object 
            mappings[key] = domainList;
        }
        // Update state with new mapping object
        this.setState({
            data: mappings
        });
    const address = this.state.address;
    this.setState({
        searchedAddress: this.state.address,
    })

    if (address === "") {
        this.setState({
            domainsOwned: [],
        })
    }
    else if (!(address in this.state.data)) {
        this.setState({
            domainsOwned: ['Not Found'],
        })
    } else {
        let listOfDomains = this.state.data[address]

        this.setState({
            domainsOwned: listOfDomains,
        })
    }
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
                placeholder="Enter a valid Ethereum Public Address"
                aria-label="public_address"
                aria-describedby="basic-addon2"
                onChange={this.handlePublicAddress}
              />
              <Button variant="outline-secondary" id="button-addon2" onClick={this.handleOwnerLookup}>
                Search
              </Button>
            </InputGroup>
          </div>
          <Card props={{"domainOwner": this.state.searchedAddress, "domainsOwned" : this.state.domainsOwned}}/>
        </div>
      </>
    );
  }
}

export default DomainList_;
