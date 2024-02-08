import './App.css'
import { EthereumClient, w3mConnectors, w3mProvider, } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { configureChains, createConfig, WagmiConfig, useAccount, useEnsName, useConnect } from "wagmi";
import { mainnet, optimism, polygon, bsc, bscTestnet } from "wagmi/chains";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import React from 'react';
import Web3 from 'web3';
import abi from './abi.json';
import ReadContract from './components2/ReadContract';
import WriteContract from './components2/WriteContract';
import axios from "axios";

const NEXT_PUBLIC_PROJECT_ID = "5c68c261ef4e658f4d892c2f0ffe6c9e";
// 1. Get projectID at https://cloud.walletconnect.com
if (!NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [mainnet, polygon, optimism, bsc, bscTestnet];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  publicClient,
});

export default function Reward({ Component, pageProps }) {
  const { address, isConnected, isConnecting } = useAccount();
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactions1, setTransactions1] = useState([]);
  const [daysSinceLastPurchase, setDaysSinceLastPurchase] = useState(0);
  const Uint256 = 1000000000000000000;
  const [reward, setReward] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [contractAddress, setContractAddress] = useState('0x32a215ff4bcee940fb8e281c1ff2ae58d92cc022');
  const [contract, setContract] = useState(null);
  const [claimed, setClaimed] = useState('');
  const [lastClaim, setLastClaim] = useState('');
  const [nextClaim, setNextClaim] = useState('');

  const handleClaim = async () => {
    if (contract && walletAddress) {
      try {
        await contract.methods.claimReward().send({ from: walletAddress });
        console.log('Claim successful');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchTokenBalance = async () => {
    try {
      const ethereumClient = new EthereumClient(wagmiConfig, chains);
      const address0 = ethereumClient.getAccount();
      const address = address0.address;

      const apiKey = "WRJ9W5AYS7BMRG7YNCS7CT28WQX9GM3J5G";
      const response = await fetch(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x6Af7600fFdE262A9F6EbC10eC2D8f6A6Bc416Eeb&address=${address}&apikey=${apiKey}`);
      const data = await response.json();
      console.log(data);

      const balance = data.result;
      setTokenBalance((balance / 10 ** 18).toFixed(2));
    } catch (error) {
      console.log(error);
    }
  };
  if (isConnected && isNaN(tokenBalance))
    fetchTokenBalance(address);


  useEffect(() => {
    checkLastTransactionType();
  }, [transactions]);


  const fetchClaimedRewards = async () => {
    if (contract && walletAddress && claimAmount) {
      try {
        const rewards = await contract.methods.claimedRewards(walletAddress).call();
        setClaimed(rewards);
        console.log(claimed);
      } catch (error) {
        console.log("Error fetching claimed rewards:", error);
      }
    }
  };

  const rewarder = async () => {
    if (tokenBalance < 10000000000) {
      const transrew = (tokenBalance * 0.02);
      setReward(transrew - claimed / Uint256);
    } else if (tokenBalance < 50000000000) {
      const transrew = (tokenBalance * 0.03);
      setReward(transrew - claimed / Uint256);
    } else if (tokenBalance < 100000000000) {
      const transrew = (tokenBalance * 0.02);
      setReward(transrew - claimed / Uint256);
    } else {
      const transrew = (tokenBalance * 0.01);
      setReward(transrew - claimed / Uint256);
    }
  };

  const fetchTransactions = async () => {
    try {
      const ethereumClient = new EthereumClient(wagmiConfig, chains);
      const address0 = ethereumClient.getAccount();
      const address = address0.address;
      const response = await fetch(
        'https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x6af7600ffde262a9f6ebc10ec2d8f6a6bc416eeb&address=' +
        address + '&page=1&offset=100&sort=desc&apikey=21PVICUJW1Y9XCNWUYSWB6AGETBJDTYFWI'
      );

      if (response.ok) {
        const data = await response.json();
        const filteredTransactions = data.result.filter((transaction) => {
          if (transaction.from === '0x970dde810f59c15e79a195c96b89a744b80f326a') {
            transaction.Type = 'BUY';
          } else {
            transaction.Type = 'Sell';
          }
          return (
            transaction.from === '0x970dde810f59c15e79a195c96b89a744b80f326a' ||
            transaction.to === '0x970dde810f59c15e79a195c96b89a744b80f326a'
          );
        });
        setTransactions(filteredTransactions);
      } else {
        console.error('Error retrieving transactions:', response.status);
      }
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  const fetchTransactions2 = async (address) => {
    try {
      const ethereumClient = new EthereumClient(wagmiConfig, chains);
      const address0 = ethereumClient.getAccount();
      const address = address0.address;
      const response = await fetch(
        'https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x6af7600ffde262a9f6ebc10ec2d8f6a6bc416eeb&address=' +
        address + '&page=1&offset=100&sort=desc&apikey=21PVICUJW1Y9XCNWUYSWB6AGETBJDTYFWI'
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const filteredTransactions = data.result.filter((transaction) => {
          if (transaction.from === "0x32a215ff4bcee940fb8e281c1ff2ae58d92cc022") {
            transaction.Type = 'Claim';
            const Value = transaction.value;
            const DateClaim = new Date(transaction.timeStamp * 1000).toLocaleString();
            const NextClaim = new Date(transaction.timeStamp * 1000);
            NextClaim.setDate(NextClaim.getDate() + 31)
            console.log(NextClaim);
            setClaimed(Value);
            setLastClaim(DateClaim);
            setNextClaim(NextClaim.toLocaleString());
          } else {
            transaction.Type = 'No Claim';
          }
          return (
            transaction.from === '0x32a215ff4bcee940fb8e281c1ff2ae58d92cc022'
          );
        });
        setTransactions1(filteredTransactions);
      } else {
        console.error('Error retrieving transactions:', response.status);
      }
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnected(true);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletAddress(accounts[0]);
        fetchTokenBalance(accounts[0]);
        setReward(0);
        const web3 = new Web3(window.ethereum);
        const deployedContract = new web3.eth.Contract(abi, contractAddress);
        setContract(deployedContract);
        fetchTransactions();
        fetchTransactions2();
        fetchClaimedRewards();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('MetaMask not detected.');
    }
  };








  const checkLastTransactionType = () => {
    if (transactions.length > 0) {
      const lastTransaction = transactions[0];
      const transactionType = lastTransaction.Type;
      if (transactionType === 'BUY') {
        const timestamp = lastTransaction.timeStamp;
        const currentDate = new Date();
        const transactionDate = new Date(timestamp * 1000);
        const timeDiff = Math.abs(currentDate.getTime() - transactionDate.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDaysSinceLastPurchase(daysDiff);
      } else {
        setDaysSinceLastPurchase(0);
      }
    }
  };



  // 3. Configure modal ethereum client
  const ethereumClient = new EthereumClient(wagmiConfig, chains);
  const queryClient = new QueryClient();

  const [ready, setReady] = useState(false);


  useEffect(() => {
    setReady(true);
    fetchTransactions();
    fetchTransactions2();
    fetchClaimedRewards();
    fetchTokenBalance();
  }, []);
  return (
    <>
      {/* {ready ? (
        <WagmiConfig config={wagmiConfig}>
<ReadContract />
        </WagmiConfig>
      ) : null}*/}
      <div id="rewards">
        {/* Predefined button  */}
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        {/* Predefined button  */}
        <Web3Button icon="show" label="Connect Wallet" balance="show" />
        <br />

        {/* Network Switcher Button */}
        <Web3NetworkSwitch />

        <br />
        <QueryClientProvider client={queryClient} contextSharing={true}>
        </QueryClientProvider>
        <div>
          <p>Connected Wallet Address: <w3m-address-text></w3m-address-text></p>
          <p>Token Balance: {tokenBalance}  <span>Crazy Frog </span></p>
          <button onClick={rewarder}>CHECK POSSIBLE REWARD</button>
          <p>Your Possible Reward: {reward}  <span>Crazy Frog </span></p>
          <p>Days without Sells: {daysSinceLastPurchase} / <span>30</span></p>
          <p><span>Last Claim:</span> {lastClaim}</p>
          <p><span>Next Claim:</span> {nextClaim}</p>
          {daysSinceLastPurchase > 30 && (
            <div>
              <span><input
                id="claim"
                type="number"
                placeholder="Claim Amount"
                value={(reward)}
                readOnly
              /></span>
              <br></br>
              <br></br>
              <br></br>
              {ready ? (
                <WagmiConfig config={wagmiConfig}>
                  <WriteContract />
                </WagmiConfig>
              ) : null}
            </div>
          )}
          <div id="txnlist">
            <h1>Claimed REWARD List</h1>
            <ul>
              {transactions1.map((transaction) => (
                <li key={transaction.hash}>
                  <p id="Hash">Hash: {transaction.hash}</p>
                  <p>Timestamp: {new Date(transaction.timeStamp * 1000).toLocaleString()}</p>
                  <p>Type: {transaction.Type}</p>
                  <p>Claimed: {transaction.value / Uint256} Crazy Frog </p>
                </li>
              ))}
            </ul>
          </div>
          <div id="txnlist">
            <h1>Transaction List</h1>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.hash}>
                  <p id="Hash">Hash: {transaction.hash}</p>
                  <p>Timestamp: {new Date(transaction.timeStamp * 1000).toLocaleString()}</p>
                  <p>Type: {transaction.Type}</p>
                  <p>Amount: {((transaction.value) / Uint256).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}