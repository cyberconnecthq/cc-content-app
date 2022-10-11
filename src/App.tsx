import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";

/* Constants */
const CHAIN_ID = 5; // Goerli Testnet Network chain id

function App() {
  /* State variable to store the provider */
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);

  /* State variable to store the address */
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    /* Check if the user first connected */
    if (!(provider && address)) return;

    /* Function to check if the connected network is the Goerli Testnet Network */
    checkNetwork(provider);
  }, [provider, address]);

  const connectWallet = async () => {
    try {
      /* Function to detect most providers injected at window.ethereum */
      const detectedProvider = (await detectEthereumProvider()) as ExternalProvider;

      /* Check if the Ethereum provider exists */
      if (!detectedProvider) {
        throw new Error("Please install MetaMask!");
      }

      /* Ethers Web3Provider wraps the standard Web3 provider injected by MetaMask */
      const web3Provider = new ethers.providers.Web3Provider(detectedProvider);

      /* Connect to Ethereum. MetaMask will ask permission to connect user accounts */
      await web3Provider.send("eth_requestAccounts", []);

      /* Get the signer from the provider */
      const signer = web3Provider.getSigner();

      /* Get the address of the connected wallet */
      const address = await signer.getAddress();

      /* Set the providers in the state variables */
      setProvider(web3Provider);

      /* Set the address in the state variable */
      setAddress(address);

    } catch (error) {
      /* This error code indicates that the user rejected the connection */
      if (error.code === 4001) {
        /* Reset the state variables */
        setProvider(undefined);
        setAddress(undefined);
      } else {
        /* Display error message */
        alert(error.message);
        console.error(error);
      }
    }
  };

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
        /* Display error message */
        alert(error.message);
        console.error(error);
      }
    }
  }

  if (!address) {
    return <button onClick={connectWallet}>Connect with MetaMask</button>;
  }

  return (
    <div>
      <p>Connected with MetaMask</p>
      <p>Address: {address}</p>
    </div>
  );
}

export default App;
