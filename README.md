# CyberConnect Content app

## Introduction

**CyberConnect Protocol** is a decentralized social graph protocol that helps Web3 applications bootstrap network effects. It empowers users to truly own their social identities, contents, and connections in a social network and provides developers with a rich set of tools to build applications with meaningful social experiences.

## Project

The repo contains the full code for the **How to Build Content app** guide from the [CyberConnect Developer Center](https://docs.cyberconnect.me/).

The project was built to help developer with the basic functionalities necessary to develop a content application by taking advantage of the full power of CyberConnect APIs.

This example contains all the steps described in the docs:

1. [Create a Profile](https://docs.cyberconnect.me/how-to/build-content-app/create-a-profile)
2. [Authentication](https://docs.cyberconnect.me/how-to/build-content-app/authentication)
3. [Subscribe to Profile](https://docs.cyberconnect.me/how-to/build-content-app/subscribe-to-profile)
4. [Create a Post](https://docs.cyberconnect.me/how-to/build-content-app/create-a-post)
5. [Collect a Post](https://docs.cyberconnect.me/how-to/build-content-app/collect-a-post)
6. [Middleware for Subscribe](https://docs.cyberconnect.me/how-to/build-content-app/middleware-for-subscribe)
7. [Middleware for Post](https://docs.cyberconnect.me/how-to/build-content-app/middleware-for-post)

## Prerequisites

Make sure that you have installed [Node.js](https://nodejs.org/en/download/) on your computer and [MetaMask](https://metamask.io/) extension in your Chrome browser.

## Installation

Clone the repo [https://github.com/cyberconnecthq/cc-content-app.git](https://github.com/cyberconnecthq/cc-content-app.git) and run the following command in your terminal to install all the packages that are necessary to start the development server: `npm install` or `yarn install`.

## Local Development

In this demo, you need to set below environment variables in next.config.js:
1. `NEXT_PUBLIC_API_KEY` and `NEXT_PUBLIC_API_SECRET` are for uploading metadata using **Pinata** (register on [Pinata](https://www.pinata.cloud)).
2. For development environment, you need to set `NEXT_PUBLIC_GRAPHQL_ENDPOINT` to `https://api.cyberconnect.dev/testnet/`.
3. When you call the `relay` mutation from the API, you need to put `X-API-KEY: process.env.NEXT_PUBLIC_CYBERCONNECT_API_KEY` in the request header, you can register the key from the [dashboard](https://dashboard.cyberconnect.me/).
4. Last but not the least, make sure to set `NEXT_PUBLIC_CHAIN_ID` to `97` which is BSC Testnet.

After setting up all the environment variables, to start the local development server run the following command and open up the browser window http://localhost:3000. Most changes are reflected live without having to restart the server: `npm run dev` or `yarn dev`.

## Contact

These are our communication channels, so feel free to contact us:

-   [Discord](https://discord.com/invite/cUc8VRGmPs) `#developers` channel
-   [@CyberConnectHQ](https://twitter.com/CyberConnectHQ) on Twitter
-   [Github](https://github.com/cyberconnecthq/build-nft-sbt-guide/issues) for issues

