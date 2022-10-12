import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

function ConnectWalletBtn({
    setAddress,
    setProvider,
    disabled,
}: {
    setAddress: (address: string | undefined) => void,
    setProvider: (provider: Web3Provider | undefined) => void,
    disabled: boolean,
}) {
    const handleOnClick = async () => {
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
            }
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Connect Wallet
        </button>
    );
}

export default ConnectWalletBtn;
