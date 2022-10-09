import React from "react";

import {
    checkExpired,
    getAuctionURL,
    startAuction,
} from "./dns.js"

import { ENVIRONMENT } from './configurations';

import NotExpired from './components/NotExpired';
import ExpiredNoAuction from "./components/ExpiredNoAuction.js";
import ExpiredHasAuction from "./components/ExpiredHasAuction.js";


// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class AuctionStatus extends React.Component {
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
                pathname: '/auction',
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

    // // ONLY FOR TESTING

    // setNotExpired = () => {
    //     this.setState({
    //         status: "NOT_EXPIRED"
    //     });
    // }
    // setExpiredNoAuction = () => {
    //     this.setState({
    //         status: "EXPIRED_NO_AUCTION"
    //     });
    // }
    // setExpiredHasAuction = () => {
    //     this.setState({
    //         status: "EXPIRED_HAS_AUCTION"
    //     });
    // }
    // // END - ONLY FOR TESTING

    render() {

        const cardStyle = {
            fontFamily: "arial",
            width: "80%",
            margin: "16px auto",
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            padding: "15px",
            textAlign: "center",
        };

        const innerCardStyle = {
            fontFamily: "arial",
            width: "50%",
            // margin: "16px auto",
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            // padding: "5px",
            textAlign: "center",
        }

        const scroller = {
            margin: "0 auto",
            height: "200px",
            width: "100%",
            overflow: "auto"
        }

        let status = (<div style={cardStyle}>
            <img style={{ width: "50px" }} src={require('./assets/loading.gif')} />
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
                    <img style={{ width: "100px" }} src={require('./assets/house.png')} />

                    <h1 >The Auction House</h1>
                    <p style={{ width: "80%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                        Welcome to the Auction House, powered by the <b>Ethereum</b> blockchain on the <b>{ENVIRONMENT.toUpperCase() === 'GANACHE' ? 'Local Ganache' : ENVIRONMENT.toUpperCase() === 'ROPSTEN' ? ' Ropsten' : ENVIRONMENT.toUpperCase() === 'GOERLI' ? ' Goerli' : 'undefined'}</b> network!
                        {/* <br /><br /> */}
                        {/* You have selected the domain: {this.state.domainName}<br /> */}
                        <br /><br />
                        <input style={{ margin: "5px" }} type="submit" value="Back to Auction House" onClick={this.handleBack} />
                        <br />
                        <input style={{ margin: "5px" }} type="submit" value="Back to Home Page" onClick={this.handleDoubleBack} />
                    </p>
                    {/* Only for Testing:<br />
                    {/* <input style={{ margin: "5px" }} type="submit" value="Not Expired" onClick={this.setNotExpired} />
                    <input style={{ margin: "5px" }} type="submit" value="Expired No Auction" onClick={this.setExpiredNoAuction} />
                    <input style={{ margin: "5px" }} type="submit" value="Expired Has Auction" onClick={this.setExpiredHasAuction} /> */}
                    {/* <br />Blind Auction Contract Address: {this.state.contractAddress} */}

                </div>
                {status}
            </>
        );
    }
}

export default AuctionStatus;