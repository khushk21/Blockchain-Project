import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
const BigNumber = require('bignumber.js');
const { soliditySha3, toWei, fromAscii, fromWei } = require("web3-utils");
import artifact from "../build/contracts/BlindAuction.json";
const myAddress = "0x132982D9c32E206a8A814cCdbEe09bf0Baa01A71"; // Dummy Address to call neutral contracts

import { ENVIRONMENT, infuraWSSRopsten, infuraWSSGoerli } from './configurations';

// Checking Environment
const web3 = ENVIRONMENT.toUpperCase() === 'GANACHE'
    ? new Web3(Web3.currentProvider || new Web3.providers.HttpProvider("http://localhost:7545"))
    : ENVIRONMENT.toUpperCase() === 'ROPSTEN'
        ? new Web3(
            Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSSRopsten))
        :
        ENVIRONMENT.toUpperCase() === 'GOERLI'
            ? new Web3(
                Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSSGoerli))
            : ''

// Start of Functions
export const biddingEnd = async (contractAddress) => {

    const contract = new web3.eth.Contract(artifact.abi, contractAddress);
    let result = BigNumber(await contract.methods.biddingEnd().call({ from: myAddress }));
    let output = result.c[0];

    return output;
}

export const revealEnd = async (contractAddress) => {
    const contract = new web3.eth.Contract(artifact.abi, contractAddress);
    let result = BigNumber(await contract.methods.revealEnd().call({ from: myAddress }));
    let output = result.c[0];

    return output;
}

export const bid = async (sendValue, value, real, secret, contractAddress) => {
    const CHAIN_ID = ENVIRONMENT.toUpperCase() === 'GANACHE'
        ? await web3.eth.getChainId()
        : ENVIRONMENT.toUpperCase() === 'ROPSTEN'
            ? 3
            : ENVIRONMENT.toUpperCase() === 'GOERLI' ? 5
                : ''

    let hashBid1 = soliditySha3(
        toWei(value), // hash need to change to wei
        real,
        fromAscii(secret).padEnd(66, 0)
    ); // to make real a boolean

    console.log("hashBid1: " + hashBid1)

    const provider = await detectEthereumProvider();

    if (provider) {

        ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: ethereum.selectedAddress,
                    to: contractAddress,
                    value: parseInt(web3.utils.toWei(sendValue, 'ether')).toString(16),
                    gas: web3.utils.toHex(3000000),
                    gasPrice: web3.utils.toHex(20000000000),

                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "bid",
                            type: "function",
                            inputs: [
                                {
                                    type: 'bytes32',
                                    name: 'blindedBid'
                                }
                            ],
                        },
                        [hashBid1]
                    ),
                    chainId: CHAIN_ID,
                },
            ],
        });
    } else {
        console.log("Please install MetaMask!");
    }
}

export const reveal = async (values, reals, secrets, contractAddress) => {
    const CHAIN_ID = ENVIRONMENT.toUpperCase() === 'GANACHE'
        ? await web3.eth.getChainId()
        : ENVIRONMENT.toUpperCase() === 'ROPSTEN'
            ? 3
            : ENVIRONMENT.toUpperCase() === 'GOERLI' ? 5
                : ''

    const provider = await detectEthereumProvider();

    if (provider) {

        ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: ethereum.selectedAddress,
                    to: contractAddress,
                    value: parseInt(web3.utils.toWei('0', 'ether')).toString(16),
                    gas: web3.utils.toHex(3000000),
                    gasPrice: web3.utils.toHex(20000000000),

                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "reveal",
                            type: "function",
                            inputs: [
                                {
                                    type: 'uint256[]',
                                    name: 'values'
                                },
                                {
                                    type: 'bool[]',
                                    name: 'reals'
                                },
                                {
                                    type: 'bytes32[]',
                                    name: 'secrets'
                                }
                            ],
                        },
                        [values, reals, secrets]
                    ),
                    chainId: CHAIN_ID,
                },
            ],
        });
    } else {
        console.log("Please install MetaMask!");
    }
}

export const auctionEnd = async (contractAddress) => {
    const CHAIN_ID = ENVIRONMENT.toUpperCase() === 'GANACHE'
        ? await web3.eth.getChainId()
        : ENVIRONMENT.toUpperCase() === 'ROPSTEN'
            ? 3
            : ENVIRONMENT.toUpperCase() === 'GOERLI' ? 5
                : ''

    const provider = await detectEthereumProvider();
    if (provider) {

        ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: ethereum.selectedAddress,
                    to: contractAddress,
                    value: parseInt(web3.utils.toWei('0', 'ether')).toString(16),
                    gas: web3.utils.toHex(3000000),
                    gasPrice: web3.utils.toHex(20000000000),
                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "auctionEnd",
                            type: "function",
                            inputs: [],
                        },
                        []
                    ),
                    chainId: CHAIN_ID,
                },
            ],
        }).then(() => {
            window.alert('Ending this auction... Please refresh the page once the Metamask Transaction is confirmed.')
        });
    } else {
        console.log("Please install MetaMask!");
    }
};

export const highestBidder = async (contractAddress) => {

    console.log('enter async highestBidder')
    const contract = new web3.eth.Contract(artifact.abi, contractAddress);
    let highestBidderAddreses = await contract.methods.highestBidder().call({ from: myAddress });

    return highestBidderAddreses;
}

export const highestBid = async (contractAddress) => {
    const contract = new web3.eth.Contract(artifact.abi, contractAddress);
    let highestBidValue = await contract.methods.highestBid().call({ from: myAddress });
    highestBidValue = fromWei(highestBidValue)
    return highestBidValue;
}




