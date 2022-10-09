import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import artifact from "../build/contracts/Dns.json";
import {
    ENVIRONMENT,
    DnsContractAddressGanache,
    DnsContractAddressRopsten,
    DnsContractAddressGoerli,
    infuraWSSRopsten,
    infuraWSSGoerli

} from './configurations'

const myAddress = "0x612f3f3bc105eb95b14Af4A93D9788cC888E6054"; // Used only for neutral contract calls

// Checking Environment

export const DnsContractAddress = ENVIRONMENT.toUpperCase() === 'ROPSTEN'
    ? DnsContractAddressRopsten :
    ENVIRONMENT.toUpperCase() === 'GANACHE'
        ? DnsContractAddressGanache
        : ENVIRONMENT.toUpperCase() === 'GOERLI'
            ? DnsContractAddressGoerli
            : ''

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

const contract = new web3.eth.Contract(artifact.abi, DnsContractAddress);

// Start of Functions

export const lookupAddress = async (addr) => {
    const result = await contract.methods.getRegisteredURL(addr).call({ from: myAddress });
    return { ownerAddress: result };
};

export const getAddressList = async () => {
    const result = await contract.methods.getAddresses().call({ from: myAddress });
    return { addressList: result }
}

export const getURLCount = async (addr) => {
    const result = await contract.methods.getURLCount(addr).call({ from: myAddress });
    return { count: result }
}

export const getURL = async (addr, idx) => {
    const result = await contract.methods.getURL(addr, idx).call({ from: myAddress });
    return { domainName: result }
}

export const sendETH = async (amount, ownerAddress) => {

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
                    to: ownerAddress,
                    value: parseInt(web3.utils.toWei(amount)).toString(16),
                    gas: web3.utils.toHex(3000000),
                    gasPrice: web3.utils.toHex(20000000000),
                    data: null,
                    chainId: CHAIN_ID,
                },
            ],
        });
    } else {
        window.alert("Please install MetaMask!");
        console.log("Please install MetaMask!");
    }
}

export const checkExpired = async (url) => {
    const result = await contract.methods.checkExpired(url).call({ from: myAddress });
    return { expired: result }
}

export const getExpired = async (url) => {
    const result = await contract.methods.getExpired(url).call({ from: myAddress });
    return result;
}

export const testFuncParam = async (number) => {
    const result = await contract.methods.testFuncParam(number).call({ from: myAddress });
    return { value: result }
}

export const testFunc = async () => {
    const result = await contract.methods.testFunc().call({ from: myAddress });
    return { name: result }
}

export const testRegisterFunc = async (url, address) => {

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
                    to: DnsContractAddress,
                    value: parseInt(web3.utils.toWei('0', 'ether')).toString(16),
                    gas: web3.utils.toHex(1000000),
                    gasPrice: web3.utils.toHex(15000),

                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "testRegisterFunc",
                            type: "function",
                            inputs: [
                                {
                                    type: 'string',
                                    name: 'url'
                                },
                                {
                                    type: 'address',
                                    name: 'address'
                                }
                            ],
                        },
                        [url, address]
                    ),
                    chainId: CHAIN_ID,
                },
            ],
        });
    } else {
        window.alert("Please install MetaMask!");
        console.log("Please install MetaMask!");
    }

}

export const getAuctionURL = async (url) => {
    const result = await contract.methods.getAuctionURL(url).call({ from: myAddress });
    return { auctionAddress: result }
}

export const startAuction = async (domainURL) => {

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
                    to: DnsContractAddress,
                    value: parseInt(web3.utils.toWei('0', 'ether')).toString(16),
                    gas: web3.utils.toHex(3000000),
                    gasPrice: web3.utils.toHex(20000000000),

                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "startAuction",
                            type: "function",
                            inputs: [
                                {
                                    type: 'string',
                                    name: 'domainURL'
                                }
                            ],
                        },
                        [domainURL]
                    ),
                    chainId: CHAIN_ID,
                },
            ],
        }).then(result => {
            window.alert("A new auction is now being created. Please refresh the page once the Metamask Transaction is confirmed.");
        });
    } else {
        console.log("Please install MetaMask!");
    }
}




