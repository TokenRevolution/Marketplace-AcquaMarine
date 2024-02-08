 import './App.css';
import Web3 from 'web3';
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { configureChains, createConfig, WagmiConfig, useAccount } from "wagmi";
import { mainnet, optimism, polygon, bsc, bscTestnet, polygonMumbai } from "wagmi/chains";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useContractWrite } from 'wagmi';
import axios from "axios";
import routerabi from './components3/routerabi.json';

const NEXT_PUBLIC_PROJECT_ID = "5c68c261ef4e658f4d892c2f0ffe6c9e";
// 1. Get projectID at https://cloud.walletconnect.com
if (!NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [mainnet, bsc, bscTestnet, polygonMumbai];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Swap({ Component, pageProps }) {
  const { address } = useAccount(); // Get the connected wallet address
  const [CRAZYFROGBalance, setCRAZYFROGBalance] = useState(null);
  const [amountIn, setAmountIn] = useState(0);

  useEffect(() => {
    const fetchCRAZYFROGBalance = async () => {
      const apiKey = "WRJ9W5AYS7BMRG7YNCS7CT28WQX9GM3J5G"; // Replace with your BscScan API key
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x6Af7600fFdE262A9F6EbC10eC2D8f6A6Bc416Eeb&address=${address}&apikey=${apiKey}`;

      try {
        const response = await axios.get(url);
        const balance = response.data.result;
        setCRAZYFROGBalance(balance);
      } catch (error) {
        console.log("Error fetching CRAZYFROG balance:", error);
      }
    };

    fetchCRAZYFROGBalance();
  }, [address]);

  const WriteContract = () => {
    const { isLoading, isSuccess, write } = useContractWrite({
      address: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router contract address
      abi: routerabi,
      functionName: 'swapExactETHForTokens', // Swap function
      chainId: 56, // Binance Smart Chain chain ID
    });

    const swapExactETHForTokens = async () => {
      try {
        const params = [
          amountIn,
          ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x6af7600ffde262a9f6ebc10ec2d8f6a6bc416eeb'],
          address, // Replace with the recipient address
          Math.floor(Date.now() / 1000) + 60 * 10, // Replace with the deadline timestamp
        ];
    
        await write(params, { value: amountIn });
      } catch (error) {
        console.log("Swap error:", error);
      }
    };


    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h2>Swap</h2>
        <div>
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
          />
          <button onClick={swapExactETHForTokens}>Swap</button>
        </div>
      </div>
    );
  };

  const queryClient = new QueryClient();

  return (
    <>
      {address ? (
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <div>
              <h1>CRAZY FROG Balance: {(CRAZYFROGBalance / 10 ** 18).toFixed(4)}</h1>
              <WriteContract />
            </div>
          </QueryClientProvider>
        </WagmiConfig>
      ) : null}
      {/* Predefined button  */}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />
      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
    </>
  );
}