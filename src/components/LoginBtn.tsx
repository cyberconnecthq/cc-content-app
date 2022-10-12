import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@apollo/client";
import { LOGIN_GET_MESSAGE, LOGIN_VERIFY } from "../graphql";
import { DOMAIN } from "../helpers/constants";

function LoginBtn({
    provider,
    address,
    checkNetwork,
    disabled,
    setAccessToken,
}: {
    provider: Web3Provider | undefined,
    address: string | undefined,
    checkNetwork: (provider: Web3Provider) => Promise<void>,
    disabled: boolean,
    setAccessToken: (accessToken: string) => void,
}) {
    const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
    const [loginVerify] = useMutation(LOGIN_VERIFY);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("Connect with MetaMask.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the address from the provider */
            const account = await signer.getAddress();

            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Get the chain id from the network */
            const chainID = network.chainId;

            /* Get the message from the server */
            const messageResult = await loginGetMessage({
                variables: {
                    input: {
                        address: account,
                        domain: DOMAIN,
                        chainID: chainID,
                    },
                },
            });
            const message = messageResult?.data?.loginGetMessage?.message;

            /* Get the signature for the message signed with the wallet */
            const signature = await signer.signMessage(message);

            /* Verify the signature on the server and get the access token */
            const accessTokenResult = await loginVerify({
                variables: {
                    input: {
                        address: account,
                        domain: DOMAIN,
                        chainID: chainID,
                        signature: signature,
                    },
                },
            });
            const accessToken = accessTokenResult?.data?.loginVerify?.accessToken;

            /* Log the access token */
            console.log("~~ Access token ~~");
            console.log(accessToken);

            /* Save the access token in local storage */
            localStorage.setItem("accessToken", accessToken);

            /* Set the access token in the state variable */
            setAccessToken(accessToken);

            /* Display success message */
            alert(`Successfully logged in!`);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Login
        </button>
    );
}

export default LoginBtn;
