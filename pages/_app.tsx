import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../apollo";
import { AuthContextProvider } from "../context/auth";
import { ModalContextProvider } from "../context/modal";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthContextProvider>
        <ModalContextProvider>
          <Component {...pageProps} />
        </ModalContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
