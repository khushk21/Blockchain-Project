# CZ4153 Blockchain Technology: DNS Blind Auction House

Welcome to the repository of the DNS Blind Auction House. 

This project is a collaboration between **Shen Chen**, **Sim Zhi Qi**, and **Vincent Wong**, and implements a Decentralized Domain Registrar that allows users on the Ethereum Blockchain Network to bid for unregistered domain names of their choice.

The Decentralized Domain Registrar, titled **'DNS Blind Auction House'**, allows users to bid for domain names using the 'commit-and-reveal' blind auction bidding process to interact with the blockchain, supporting features such as listing of registered domains, query the actual Ethereum public address (owner) behind the domain, bid for an unregistered domain, and many more features.

## Contents
* [Setting Up Environment](#Environment)
  * [0. Setting Up Pre-Requisites](#PreReqs)
  * [1. Setting up Project Directory](#Directory)
  * [2. Setting Up using the Ganache Environment](#GanacheEnv)
  * [3. Setting up with Ropsten Test Net](#Ropsten)
   * [3. Setting up with Goerli Test Net](#Goerli)
* [Setting Up the React Front End Web Application](#FrontEnd)
* [Navigating around the DNS Blind Auction House Web Application](#Navigation)
  * [1. The Auction House](#AuctionHouse)
  * [2. List of Registered Domains](#ListRegisteredDomains)
  * [3. Look-Up the Owner of a Domain](#OwnerOfDomain)
  * [4. Look-Up the Domain(s) of an Owner](#DomainsOfOwner)
  * [5. Send ETH to a Domain](#SendETH)
* [Testing of Contracts](#Testing)
  * [1. DNS Contract](#DNSContract)
  * [2. Blind Auction Contract](#BlindAuction)


<a name="Environment"></a>
## Setting Up Environment

<a name="PreReqs"></a>
### 0. Setting up Pre-Requisites

Do ensure that the following are installed first:

* NodeJS - can be installed [from this link](https://nodejs.org/en/).
* npm - can be installed [from this link](https://www.npmjs.com/get-npm).
* Metamask Google Chrome Extension - can be installed [from this link](https://metamask.io/download.html).
* Ganache - can be installed [from this link](https://www.trufflesuite.com/ganache).

Next, we will install Truffle with the following commands:

```bash
npm install truffle -g 
truffle version # To check if Truffle has been installed successfully
```
<a name="Directory"></a>
### 1. Setting up Project Directory

To use the DNS Blind Auction House, you will first need to clone the repository to your local computer. You may do so in your own desired local directory with the following command

```bash
git clone https://github.com/zhiqisim/Blind-Auction.git
```

We will be utilising the `Migrations.sol`, `Dns.sol` and `BlindAuction.sol` Solidity files for our smart contracts.

We can compile the contracts with the following command:

```bash
truffle compile
```

We should now see a new folder named `build/contracts`, which contains the files `BlindAuction.json`, `Dns.json`, and `Migrations.json`.

<a name="GanacheEnv"></a>
### 2. Setting Up using the Ganache Environment

<a name="GanacheToProject"></a>
#### 2.1 Linking of Ganache Workplace with Project

Start your Ganache application by double clicking the downloaded app image during installation.

Click on "New Workspace (Ethereum)", which will create a running instance of the Ethereum blockchain locally -- together with 10 accounts created, each with a balance of 100 ETH.

Next, we need to link the **DNS Blind Auction House** project with your local Ganache blockchain, by specifying a customized workspace name and the path to the file `truffle-config.js`.

![Ganache Workspace Settings](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/ganache.jpeg)

Once inputted successfully, click on "Add Project" to link and save the project in Ganache.

Now, we can deploy our contracts. We do so with the following command:

```bash
truffle migrate --network local --reset
```

During the migration, take note of the contract address obtained after deploying the Dns Solidity contract, as highlighted in the image below.

![DNS Migration Contract Address](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/dns%20migrations.jpeg)

Navigate into the `./webapp/configurations.js` file. Make the following 2 changes:

1. Change the address in the constant `DnsContractAddressGanache` to the value highlighted in the image above.
2. Change the `ENVIRONMENT` constant to `'Ganache'`.

<a name="GanacheToMetamask"></a>
#### 2.2 Linking of Metamask to the Ganache Environment

To properly run the environment with Ganache and make payments to the Auction House smart contracts, we will need to link your Metamask account with the Ganache localhost.

Head to [this link](https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf) to properly link your Metamask to Ganache.

Once done, your Metamask account and the project are both now successfully connected to Ganache. You may now proceed directly to the section [Setting Up the React Front End Web Application](#FrontEnd).

<a name="Ropsten"></a>
### 3. Setting up with Ropsten Test Net

#### 3.1 Linking the Project to the Ropsten Network
Our group has already successfully deployed our smart contracts onto the Ropsten Test Net. 

To connect to the Testnet, simply navigate into the `./webapp/configurations.js` file. Make the following change:

1. Change the `ENVIRONMENT` constant to `'Ropsten'`.

And that's it! The project is now linked to the Ropsten Network.

#### 3.2 Linking of Metamask to the Ropsten Network

Ensure that you have an account in Metamask with ETH in the Ropsten Testnet. You may get ETH for the Ropsten TestNet from [this faucet](https://faucet.metamask.io/).

Once done, your Metamask Account and the project are now both successfully connected to Ropsten. If you do not plan to re-migrate our contracts onto the Ropsten Testnet, you can skip section 4.3, and proceed directly to the section [Setting Up the React Front End Web Application](#FrontEnd).

#### 3.3 Re-Migrating our Contracts to the Ropsten Testnet

If you would like to test the deployment of all of our Smart Contracts from scratch, instead of using our pre-deployed contracts, you will need to first connect to Infura. Create an Infura account [here](https://infura.io/register), and create a new project.

Modify the PROJECT ID in the `./truffle-config.js` to reflect your Infura account PROJECT ID for the Ropsten testnet.

Create a file named .secret, and copy & paste your Metamask mnemonic seed into this file. To find out about your seed, go to MetaMask top right "Settings > Security & Privacy > Reveal Seed Phrase".

Add HDWalletProvider dependency as follows:

```bash
npm install @truffle/hdwallet-provider
```

Finally, re-deploy/re-migrate our smart contracts onto the Ropsten Testnet with the following command:

```bash
truffle migrate --network ropsten --reset
```

During the migration, take note of the contract address obtained after deploying the Dns Solidity contract, as highlighted in the image below.

![DNS Migration Contract Address](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/dns%20migrations.jpeg)

Navigate into the `./webapp/configurations.js` file. Make the following 2 changes:

1. Change the `ENVIRONMENT` constant to `'Ropsten'`.
2. Change the address in the constant `DnsContractAddressRopsten` to the value highlighted in the image above.

Once done, the smart contracts should be successfully re-deployed, and you can now proceed to the section [Setting Up the React Front End Web Application](#FrontEnd).

<a name="Goerli"></a>
### 4. Setting up with Goerli Test Net

#### 4.1 Linking the Project to the Goerli Network
Our group has already successfully deployed our smart contracts onto the Goerli Test Net. 

To connect to the Testnet, simply navigate into the `./webapp/configurations.js` file. Make the following change:

1. Change the `ENVIRONMENT` constant to `'Goerli'`.

And that's it! The project is now linked to the Goerli Network.

#### 4.2 Linking of Metamask to the Goerli Network

Ensure that you have an account in Metamask with ETH in the Goerli Testnet. You may get ETH for the Goerli TestNet from [this faucet](https://goerli-faucet.slock.it/).

Once done, your Metamask Account and the project are now both successfully connected to Goerli. If you do not plan to re-migrate our contracts onto the Testnet, you can skip section 4.3, and proceed directly to the section [Setting Up the React Front End Web Application](#FrontEnd).

#### 4.3 Re-Migrating our Contracts to the Goerli Testnet

If you would like to test the deployment of all of our Smart Contracts from scratch, instead of using our pre-deployed contracts, you will need to first connect to Infura. Create an Infura account [here](https://infura.io/register), and create a new project.

Modify the PROJECT ID in the `./truffle-config.js` to reflect your Infura account PROJECT ID for the Goerli testnet.

Create a file named .secret, and copy & paste your Metamask mnemonic seed into this file. To find out about your seed, go to MetaMask top right "Settings > Security & Privacy > Reveal Seed Phrase".

Add HDWalletProvider dependency as follows:

```bash
npm install @truffle/hdwallet-provider
```

Finally, re-deploy/re-migrate our smart contracts onto the Goerli Testnet with the following command:

```bash
truffle migrate --network goerli --reset
```

During the migration, take note of the contract address obtained after deploying the Dns Solidity contract, as highlighted in the image below.

![DNS Migration Contract Address](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/dns%20migrations.jpeg)

Navigate into the `./webapp/configurations.js` file. Make the following 2 changes:

1. Change the `ENVIRONMENT` constant to `'Goerli'`.
2. Change the address in the constant `DnsContractAddressGoerli` to the value highlighted in the image above.

Once done, the smart contracts should be successfully re-deployed, and you can now proceed to the section [Setting Up the React Front End Web Application](#FrontEnd).

<a name="FrontEnd"></a>
## Setting Up the React Front End Web Application

Navigate into the `/webapp` folder.

Execute the following commands to initialise the React Web Application.

```bash
npm install
```

Once that is done, we can run the web application on `localhost:1234` using the following command:

```bash
npm start
```

While at the site, we now need to connect our MetaMask extension to our localhost site. You may do so as follows:

![Metamask Connection 1](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/meta1.png)

![Metamask Connection 2](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/meta2.png)

You should be able to see the "Connected" label now, as follows:

![Metamask Connection 3](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/meta3.png)

Once done, we are finally ready to navigate around the Front End Website!

<a name="Navigation"></a>
## Navigating around the DNS Blind Auction House Web Application

After entering `localhost:1234`, we will see the web application page.

![Web Application](https://github.com/zhiqisim/Blind-Auction/blob/master/assets/website.jpeg)

The web application has **5 different sections**:

<a name="AuctionHouse"></a>
### 1. The Auction House

The Auction House is the entry point for users to enter to check if a domain name has already been taken up. There are three cases:

* A domain has **already been taken**, and **has not expired yet**. Users will not be able to bid for this domain name, until its current ownership expires.
* A domain's ownership has **already expired** or is **not currently owned by anyone**, and has **no existing on-going auctions**. Here, the user can choose to start a new auction, which will call the `startAuction()` function in our [DNS Smart Contract](#DNSContract).
* A domain is **not currently owned by anyone**, but already **has an ongoing auction** pegged to it. Here, the ongoing auction will be in one of three different phases:
  * **Bidding Phase:** Where users can bid in a Blind Auction. More information can be found in the [Bidding Phase](#BiddingPhase) section.
  * **Reveal Phase:** Where users reveal and prove that they were the ones who made their bids in the Bidding Phase. More information can be found in the [Reveal Phase](#RevealPhase) section.
  * **End Phase:** Where users choose to end an ongoing auction, giving the winner of the auction ownership to the domain, and refunding the losers with their bids. More information can be found in the [End Phase](#EndPhase) section.

<a name="ListRegisteredDomains"></a>
### 2. List of Registered Domains

At the bottom of the webpage is where we can see a list of Ethereum Public address, and their owned registered domain name URLs. These domain names were obtained from the [DNS Smart Contract](#DNSContract), through a series of function calls as follows:

* `getAddress()`: To get a complete list of all Ethereum public addresses that currently own domain name URLs.
* `getURLCount(ethAddress)`: To get the number of URLs owned by a particular Ethereum public address.
* `getURL(ethAddress, i)`: To get the ith domain name URL owned by a particular Ethereum public address.

All these function calls generate a mapping of Ethereum Public addresses to domain name URLs, which are then both stored and rendered from the `data` state of the web page.


<a name="OwnerOfDomain"></a>
### 3. Look-Up the Owner of a Domain

Here, we call the `getRegisteredURL(domainURL)` function from our [DNS Smart Contract](#DNSContract), which returns the Ethereum public address of the owner of a given domain name URL.

<a name="DomainsOfOwner"></a>
### 4. Look-Up the Domain(s) of an Owner

Here, since the `data` state of the web page already holds a mapping of Ethereum Public addresses to domain name URLs as mentioned above, we simply just obtain the appropriate URLs owned by a given Ethereum Public Address, by accessing the `data` state mapping.

<a name="SendETH"></a>
### 5. Send ETH to a Domain

This section allows us to send ETH to the Ethereum Public Address mapped to the domain name URL given as input. This will open up Metamask, which facilitates the ETH transaction to this public address.


<a name="Testing"></a>
## Testing of Contracts
To set up the testing with Ganache, we have to ensure that we have all the npm packages for the test by running the following command:

```bash
npm install
```

We can then run use truffle to run all the test by running the following command:

```bash
truffle test
```

We should see **31 test cases successfully passing**, with tests raging from unit testing of the various functionality of each contract, to integration testing of various scenarios ran on both contracts integrated together. All these tests mock a sample real case usage of the 2 contracts participating in an auction and registering a domain. 

<a name="DNSContract"></a>
### 1. DNS Contract
#### 1.1 State Variables
- **dns_lookup_table** : Resolving URL -> Ethereum Address
- **reverse_lookup_table** : Map of Ethereum Address -> All URLs associated
- **expiry_date** : URL Expiry Date
- **auctions** : Map of URL -> Auction Address
- **expiry** : Time for URL to expire
- **bidding_length** : Time for bidding in deployed auction
- **reveal_length** : Time for reveal in deployed auction
- **grace_period** : Time to claim URL by ending auction

#### 1.2 Functions
- **startAuction** : deploys Blind Auction contract to start a blind auction
- **registerAddress** : Handles URL registration after an auction is ended and the auction contract calls this function to update the state of this contract (Only the auction associated with the URL may call this)
- **getAddress** : View function for Frontend to query address list
- **getURLCount** : View function for Frontend to query number of domains owned by an address
- **getURL** : View function for Frontend to query the domain that a user owns
- **getRegisteredURL** : View function for Frontend to query the owner of a particular domain
- **checkExpired** : View function for Frontend to query if a domain is expired
- **getExpired** : View function for Frontend to query expiry date
- **checkAuctionEnded** : View function for front end to query if auction has been ended
- **checkAuctionPastGrace** : View function to check if auction is past the grace period
- **getAuctionURL** : View function for Frontend to get auction contract address

#### 1.3 Reasoning
Storing the forwards and backwards resolution of (address -> URLs) and (URL -> address) enables quick and simple lookup at expense of state variable updates when new URLs are added. This is an intentional trade-off made, as lookup queries should outnumber registrations by many orders of magnitude.

Auctions are deployed as required, with the auction calling the relevant callbacks to register the winner as the URL owner once ended. A check is done to ensure accounts/contracts calling the register URL function matches the internal records of the auction address associated with said URL.

Many of the auction-related state variables like the bidding and reveal time are public to enforce transparency in the bidding process. In addition, there are a few helper state variables (e.g. address_not_unique mapping) to reduce the need for computation (looping through an array to check if it already exists), reducing run time in exchange for slightly increased storage space.

Lastly, a grace period is built in to ensure that users are unable to deny a URL registration by starting an auction but not ending it.

<a name="BlindAuction"></a>
### 2. Blind Auction Contract
#### 2.1 State Variables
- **Bidding end time**
- **Reveal end time**
- **State of Auction**
- **Highest Bidder**
- **Highest Bid**
- **Map of Ethereum Address -> all bids made by user**
- **Map of Ethereum Address -> all deposits and pending returns**

#### 2.2 Functions
- **bid** : Allows user to register a bid and deposit ether for their bids
- **reveal** : Allows user to reveal their bids
- **auctionEnd** : Register user as owner of domain after end of auction and winner determined and also refund all loser's ether

#### 2.3 Reasoning

<a name="BiddingPhase"></a>
##### 2.3.1 Bidding Phase
The **Bidding Phase** allows users to bid multiple bids so that they can hide the amount of Ether being sent to the contract, as this value is publicly available to everyone due to the properties of a decentralised blockchain network. Thus, instead of taking the publicly available value as the bid value of the bidder, we convert the publicly available ETH value to be the bidder's input deposit instead, and collect his actual intended bid value separately. As the bid values (not to be confused with the deposit values) are hashed before sending, the bids are hidden from everyone else and can only be verified in the reveal phase when the user sends the same input to generate the hash from the keccak256 hash. 

Hence, during the bidding phase, all bids are hidden and the only information that is available to the public is the ether deposit amount sent by the user. Users can send multiple fake bids to deposit extra ether into their account to fake the true value of their bids, and to top up the total deposits in their account. To indicate and send fake bids, users will input a "false" value as their Real Boolean, and this value will also be hashed. Here, users just have to make sure that the total sum of all deposit inputs has to be greater than or equal to the individual (true) bid values of each bid. 

For example, a user might want to bid a bid value of 1 ETH for their domain name in the Auction House.

The user can choose to make 2 separate bids to mask their bid.

* **First Bid**: 
  * **Deposit** = 0.1 ETH, **Bid Value** = 1 ETH, **Real Boolean** = True (indicating that this bid is real), **Secret** = secretvalue
* **Second Bid**: 
  * **Deposit** = 10 ETH, **Bid Value** = 20 ETH, **Real Boolean** = False (indicating that this bid is false, and is only used to mislead other auction viewers, and also used to deposit more eth into their bidding account), **Secret** = secretvalue2

Here, the bidder's bid will successfully go through, as their total deposit of **0.1 + 10 = 10.1 ETH** is larger than their actual (true) bid of **1 ETH**. This means that the bidder would have bidded **1 ETH**, though the publicly available ETH values are **0.1 ETH** and **10 ETH** respectively in each bid transaction. 

*Note that the Bid Value, Real Boolean, and Secret Values will all be hashed and sent as data to the Blind Auction Smart Contract.*

<a name="RevealPhase"></a>
##### 2.3.2 Reveal Phase
The **Reveal Phase** allows the user to reveal all the bids they made during the Bidding Phase. Users have to reveal every single bid they made, **including** the fake ones, to verify and ensure they cannot selectively reveal certain bids. Users also only have 1 try to reveal their bids. Any subsequently reveals or wrong reveals will invalidate their bids. This is to ensure that no user can selectively reveal their bids, which would have resulted in an unfair auction that isn't truly blind, since the user would only reveal their lowest bid, selectively revealling the higher bids when they realised that they are losing the auction. This security flaw is thus prevented by only allowing the user to reveal **once**. 

Using the aforementioned user in the Bidding Phase above as an example of what to input during the Reveal Phase:
* **Bid Values**: 1, 20
* **Real Booleans**: True, False
* **Secret Values**: secretvalue, secretvalue2

*Note that values MUST be inputted in the order that they were bidded in (ie. the bid value order should be 1, 20 instead of 20, 1)*

<a name="EndPhase"></a>
##### 2.3.3 End Phase
The **End Phase** is where the user would end the auction. Once the auction has ended, the winner of the bid will have the domain name registered to their Ethereum public address and ownership transfered to them, while users that did not win the auction will be refunded the amount they bidded, as long as they successfully participated in the Reveal Phase.

*Note that we retrieve our timings to bound our functions based on the now() function in solidity, which takes the current block timestamp as our "now" time. This is how we determine when the auction Bidding Phase should end and transition to the Reveal Phase, and likewise for the Reveal Phase to transition to the End Phase.*
