import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import {
  lookupAddress,
  getAddressList,
  getURLCount,
  getURL,
} from "../controller/dns_backend.js";
import Table from "react-bootstrap/Table";

class Home_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { "Loading...": [] },
    };
  }

  async componentDidMount() {
    let addressToCountMap = {};

    // Obtain a list of eth addresses
    let result = await getAddressList();
    // Populate a key value mapping of eth addresses to counts of domains owned
    console.log(result.addressList);

    for (var j = 0; j < result.addressList.length; j++) {
      let output = await getURLCount(result.addressList[j]);
      addressToCountMap[result.addressList[j]] = await output.count;
    }
    // Populate a mappings object that contains eth addresses mapped to an array of the domains they own
    let mappings = {};

    // For each ethereum address to count mapping
    for (const [key, value] of Object.entries(addressToCountMap)) {
      console.log("enters here 2");
      let domainList = [];

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
      data: mappings,
    });
  }

  render() {
    return (
      <>
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          List of accounts and their registered domains
        </h2>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Table responsive="md" striped bordered hover>
            <thead>
              <tr style={{ backgroundColor: "white" }}>
                <th>Account Owner</th>
                <th>Domain Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.data).map((key, index) => {
                return (
                  <tr key={index} style={{ backgroundColor: "white" }}>
                    <td>{key}</td>
                    <td>{this.state.data[key].toString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <br />
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          About Us
        </h2>
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
