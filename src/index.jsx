import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";

export default function HomePage() {
  return (
    <>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />

      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)