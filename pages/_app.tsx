import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../apollo";
import { AuthContextProvider } from "../context/auth";
import { ModalContextProvider } from "../context/modal";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    (window as any)?.ethereum?.on("accountsChanged", function () {
      // Time to reload your interface with accounts[0]!
      localStorage.clear();
      window.location.reload();
    });
  }, []);
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
