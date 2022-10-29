import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import Web3 from "web3";
import { WalletProvider } from "./Redux/actions";
function getLibrary(provider) {
  // const library = new Web3(provider);
  // console.log(provider);
  // WalletProvider(provider);
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000; // frequency provider is polling
  return library;
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <App />
      </Provider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById("root")
);
