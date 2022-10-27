import React from "react";

import {
    checkExpired,
    getAuctionURL,
} from "../controller/dns_backend.js"

import NotExpired from '../components/NotExpired.js';
import ExpiredNoAuction from "../components/ExpiredNoAuction.js";
import ExpiredHasAuction from "../components/ExpiredHasAuction.js";
import { Button } from "react-bootstrap";


// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class DomainStatus_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            // State for Domain Name
            domainName: "",

            // States for handling status check:
            status: "",

            // States for storing contract address:
            contractAddress: "no contract address",

            // State for showing loading
            startedAuction: false,

        };

    }

    // Handler to Save Domain Name 
    handleDomainName = event => {
        this.setState({
            domainName: event.target.value
        })
    }

    // Handler to Check for Domain Status
    checkDomainStatus = () => {

        // Error Handling for Domain Names
        if (this.state.domainName === "") {
            window.alert("Please input a domain name!");
        } else if (!this.state.domainName.includes('.')) {
            window.alert("Please input a valid domain name!");
        } else {
            // Routing and Passing of Domain Params into Auction House
            const queryString = "domainName=" + encodeURIComponent(this.state.domainName);

            this.props.history.push({
                pathname: '/domain_bidding',
                search: '?' + queryString
            });
        }
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    handleDoubleBack = () => {
        this.props.history.goBack();
        this.props.history.goBack();

    }



    componentDidMount() {

        const checkStatus = async (queryDomainName) => {

            this.setState({
                domainName: queryDomainName
            })

            // Check if URL has expired
            let output = await checkExpired(queryDomainName);
            console.log(output.expired)
            if (!output.expired) {
                this.setState({
                    status: "NOT_EXPIRED"
                });
                return;
            }

            // Check if auction address exists
            let result = await getAuctionURL(queryDomainName);
            if (result.auctionAddress === "0x0000000000000000000000000000000000000000") {
                this.setState({
                    status: "EXPIRED_NO_AUCTION"
                });
            } else {
                this.setState({
                    status: "EXPIRED_HAS_AUCTION",
                    contractAddress: result.auctionAddress,
                });
            }
        }

        const query = new URLSearchParams(this.props.location.search);
        let queryDomainName = ''
        for (let param of query.entries()) {
            queryDomainName = param[1];
        }

        checkStatus(queryDomainName);

    }


    render() {

        const cardStyle = {
            fontFamily: "arial",
            width: "80%",
            margin: "auto",
            textAlign: "center",
            color: "white"
        };

        let status = (<div style={cardStyle}>
            <h2 >Loading Auction Information...</h2>
        </div>);

        switch (this.state.status) {
            case "NOT_EXPIRED":
                status = <NotExpired domainName={this.state.domainName} />;
                break;
            case "EXPIRED_NO_AUCTION":
                status = (
                    <ExpiredNoAuction
                        domainName={this.state.domainName}
                    />
                );
                break;
            case "EXPIRED_HAS_AUCTION":
                status = (
                    <ExpiredHasAuction
                        domainName={this.state.domainName}
                        contractAddress={this.state.contractAddress}
                    />
                );
                break;
        }

        return (
            <>
                <div style={cardStyle}>
                    <h1> BrokenChain Auction House</h1>
                    <Button variant="outline-secondary" id="button-addon2" onClick={this.handleBack}>
                        Back to Domain Bidding
                    </Button>
                        <br />
                    <Button variant="outline-secondary" id="button-addon2" onClick={this.handleDoubleBack}>
                        Back to Home
                    </Button>                    
                </div>
                {status}
            </>
        );
    }
}

export default DomainStatus_;