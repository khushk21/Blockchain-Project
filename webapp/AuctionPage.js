import React from "react";

import { ENVIRONMENT } from './configurations';


// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class AuctionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domainName: "",
        };

    }

    // Handler to Save Domain Name 
    handleDomainName = event => {
        this.setState({
            domainName: event.target.value
        })
    }

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
                pathname: '/auction/status',
                search: '?' + queryString
            });
        }
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        let queryDomainName = ''
        for (let param of query.entries()) {
            queryDomainName = param[1];
        }
        this.setState({
            domainName: queryDomainName
        })

    }

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


        return (
            <>
                <div style={cardStyle}>
                    <img style={{ width: "100px" }} src={require('./assets/house.png')} />

                    <h1 >The Auction House</h1>
                    <p style={{ width: "80%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                        Welcome to the Auction House, powered by the <b>Ethereum</b> blockchain on the <b>{ENVIRONMENT.toUpperCase() === 'GANACHE' ? 'Local Ganache' : ENVIRONMENT.toUpperCase() === 'ROPSTEN' ? ' Ropsten' : ENVIRONMENT.toUpperCase() === 'GOERLI' ? ' Goerli' : 'undefined'}</b> network!
                        <br /><br />
                        <input style={{ margin: "5px" }} type="submit" value="Back to Home Page" onClick={this.handleBack} />
                    </p>

                </div>
                <div style={cardStyle}>
                    <img style={{ height: "50px", width: "50px" }} src={require('./assets/www.png')} />

                    <h3>Enter a Domain</h3>
                    <p style={{ width: "100%", margin: "auto", fontSize: "18px", marginBottom: "20px" }} >
                        {/* Bid for your favourite domain names using a <b>"commit-and-reveal"</b> blind auction process.<br></br> */}
                        Enter a domain URL below to find out its status.
                    </p>

                    <p style={{ width: "100%", margin: "auto", fontSize: "13px", marginBottom: "20px" }} >
                        {/* Bid for your favourite domain names using a <b>"commit-and-reveal"</b> blind auction process.<br></br> */}
                        <b>Note: </b>Domain URLs can either be
                        <div style={{ textAlign: "center" }}>
                            <ol style={{ display: "inline-block" }}>
                                <li>Not yet expired - unable to start a new auction for it.</li>
                                <li>Expired - can start a new auction for it.</li>
                                <li>Expired but there exists an ongoing auction for it.</li>

                            </ol>
                        </div>

                    </p>

                    <input
                        style={{ width: "30%", margin: "5px" }}
                        type="text"
                        placeholder="Enter the domain name"
                        value={this.state.value}
                        onChange={this.handleDomainName}
                    />
                    <br></br>
                    <input style={{ margin: "5px" }} type="submit" value="Check Status" onClick={this.checkDomainStatus} />
                    <br />

                </div>
            </>
        );
    }
}

export default AuctionPage;