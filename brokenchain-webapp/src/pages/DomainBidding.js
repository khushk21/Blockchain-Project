import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

class DomainBidding_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // States for Sending ETH to a Domain
      domainName: "",
    };
  }

  // Handler to Save Domain Name
  handleDomainName = (event) => {
    this.setState({
      domainName: event.target.value,
    });
  };

  checkDomainStatus = () => {
    // Error Handling for Domain Names
    if (this.state.domainName === "") {
      window.alert("Please input a domain name!");
    } else if (!this.state.domainName.includes(".ntu")) {
      window.alert("Please input a valid domain name!");
    } else {
      // Routing and Passing of Domain Params into Auction
      const queryString =
        "domainName=" + encodeURIComponent(this.state.domainName);

      this.props.history.push({
        pathname: "/domain/status",
        search: "?" + queryString,
      });
    }
  };
  handleBack = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    let queryDomainName = "";
    for (let param of query.entries()) {
      queryDomainName = param[1];
    }
    this.setState({
      domainName: queryDomainName,
    });
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
                placeholder="Enter Domain Name to find its status"
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={this.handleDomainName}
              />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={this.checkDomainStatus}
              >
                Check Status
              </Button>
            </InputGroup>
          </div>
        </div>
      </>
    );
  }
}

export default DomainBidding_;
