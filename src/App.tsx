import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { CHAIN_ID } from "./helpers/constants";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
import ConnectWalletBtn from "./components/ConnectWallet";
import CreateProfileBtn from "./components/CreateProfileBtn";
import LoginBtn from "./components/LoginBtn";

function App() {
  /* State variable to store the provider */
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);

  /* State variable to store the address */
  const [address, setAddress] = useState<string | undefined>(undefined);

  /* State variable to store the profile ID */
  const [profileID, setProfileID] = useState<number | undefined>(undefined);

  /* State variable to store the handle */
  const [handle, setHandle] = useState<string | undefined>(undefined);

  /* State variable to store the access token */
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    /* Check if the user connected with wallet */
    if (!(provider && address)) return;

    try {
      /* Function to check if the network is the correct one */
      checkNetwork(provider);
    } catch (error) {
      /* Display error message */
      alert(error.message);
    }
  }, [provider, address]);

  const checkNetwork = async (provider: Web3Provider) => {
    try {
      /* Get the network from the provider */
      const network = await provider.getNetwork();

      /* Check if the network is the correct one */
      if (network.chainId !== CHAIN_ID) {
        /* Switch network if the chain id doesn't correspond to Goerli Testnet Network */
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0x" + CHAIN_ID.toString(16) }]);
      }
    } catch (error) {
      /* This error code indicates that the chain has not been added to MetaMask */
      if (error.code === 4902) {
        await provider.send("wallet_addEthereumChain", [{ chainId: "0x" + CHAIN_ID.toString(16), rpcUrls: ["https://goerli.infura.io/v3/"] }]);
      } else {
        /* Throw the error */
        throw error;
      }
    }
  }

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <div className="container">
          <h2>Connect Wallet</h2>
          <ConnectWalletBtn
            setProvider={setProvider}
            setAddress={setAddress}
            disabled={Boolean(provider)}
          />
          {
            (provider && address) &&
            <div>
              <div>Address:</div>
              <div>{address}</div>
            </div>
          }
          <h2>Create Profile</h2>
          <CreateProfileBtn
            provider={provider}
            address={address}
            checkNetwork={checkNetwork}
            setProfileID={setProfileID}
            setHandle={setHandle}
            disabled={!Boolean(provider && address)}
          />
          {
            handle &&
            <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" height="100%" sandbox="allow-scripts" src={`https://cyberconnect.mypinata.cloud/ipfs/bafkreic7ur7evrpy45md2xpth3zvy4mjcczzodjg7xciupty6dvmliye6i?handle=${handle}`}></iframe>
          }
          <h2>Login</h2>
          <LoginBtn
            provider={provider}
            address={address}
            checkNetwork={checkNetwork}
            setAccessToken={setAccessToken}
            disabled={!Boolean(provider && address)}
          />
          {
            (accessToken) &&
            <div>
              <div>Access token:</div>
              <div>{accessToken}</div>
            </div>
          }
        </div>
      </div>
    </ApolloProvider >
  );
}

export default App;
