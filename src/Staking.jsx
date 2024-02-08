import './App.css';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { configureChains, createConfig, WagmiConfig, useAccount } from "wagmi";
import { mainnet, optimism, polygon, bsc, bscTestnet, polygonMumbai } from "wagmi/chains";
import { Web3Button, Web3NetworkSwitch} from "@web3modal/react";
import WriteContract from './components/WriteContract';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useContractRead } from 'wagmi';
import abi from './components/stakingAbi.json';
import axios from "axios";


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

export default function Staking({ Component, pageProps }) {
  const [showWriteContract, setShowWriteContract] = useState(false);
  const [ready, setReady] = useState(false);
  const { address } = useAccount(); // Get the connected wallet address
  const [CRAZYFROGBalance, setCRAZYFROGBalance] = useState(null);


  useEffect(() => {
    setReady(true);
  }, []);
  
  const ReadContract = () => {
        useEffect(() => {
      const fetchCRAZYFROGBalance = async () => {
        const apiKey = "WRJ9W5AYS7BMRG7YNCS7CT28WQX9GM3J5G"; // Sostituisci con la tua chiave API di BscScan
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

    
    const { data: calculateReward, isError: calculateRewardError, isLoading: calculateRewardLoading, refetch: refetchCalculateReward } = useContractRead({
      address: '0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b',
      abi: abi,
      functionName: 'calculateReward',
      args: [address],
    });

    const { data: getClaimedReward, isError: getClaimedRewardError, isLoading: getClaimedRewardLoading, refetch: refetchGetClaimedReward } = useContractRead({
      address: '0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b',
      abi: abi,
      functionName: 'getClaimedReward',
      args: [address],
    });

    const { data: getTotalStaked, isError: getTotalStakedError, isLoading: getTotalStakedLoading, refetch: refetchGetTotalStaked } = useContractRead({
      address: '0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b',
      abi: abi,
      functionName: 'getTotalStaked',
      args: [address],
    });

    const { data: stakes, isError: stakesError, isLoading: stakesLoading, refetch: refetchStakes } = useContractRead({
      address: '0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b',
      abi: abi,
      functionName: 'stakes',
      args: [address],
    });

    useEffect(() => {
      const intervalId = setInterval(() => {
        refetchCalculateReward();
        refetchGetClaimedReward();
        refetchGetTotalStaked();
        refetchStakes();
      }, 10000); // Update data every 10 seconds

      return () => {
        clearInterval(intervalId); // Clean up the interval on component unmount
      };
    }, [address, refetchCalculateReward, refetchGetClaimedReward, refetchGetTotalStaked, refetchStakes]);
    

    if (calculateRewardLoading || getClaimedRewardLoading || getTotalStakedLoading || stakesLoading) {
      return <div>Loading contract data...</div>;
    }

    if (calculateRewardError || getClaimedRewardError || getTotalStakedError || stakesError) {
      return <div>Stake Token To Check Info....</div>;
    }

    // Divide il primo valore di stakes per 1000000000000000000
    const formattedFirstStake = (parseInt(stakes[0].toString()) / 1000000000000000000).toFixed(18);

    // Converte il secondo valore in un oggetto Date
    const secondStakeDate = new Date(parseInt(stakes[1].toString()) * 1000);

    // Converte il terzo valore in un oggetto Date
    const thirdStakeDate = new Date(parseInt(stakes[2].toString()) * 1000);

    // Aggiungi 20 secondi al terzo valore di stake
    const fourthStakeDate = new Date(thirdStakeDate.getTime() + 20 * 1000);

    // Aggiungi 60 secondi al primo valore di stake
    const fivethStakeDate = new Date(secondStakeDate.getTime() + 60 * 1000);

    return (
      <div>
        <h2>Contract Data</h2>
        <p>Calculate Reward: {(parseInt(calculateReward.toString()) / 1000000000000000000).toFixed(18)}</p>
        <p>Claimed Reward: {(parseInt(getClaimedReward.toString()) / 1000000000000000000).toFixed(18)}</p>
        <p>Total Staked: {(parseInt(getTotalStaked.toString()) / 1000000000000000000).toFixed(18)}</p>
        <p>Stakes:</p>
        <ul>
          <li>Staked Value {formattedFirstStake}</li>
          <li>Staked Date: {secondStakeDate.toString()}</li>
          <li>Last Reward Date: {thirdStakeDate.toString()}</li>
          <li>Next Reward Date: {fourthStakeDate.toString()}</li>
          <li>UnStake CRAZYFROG Date: {fivethStakeDate.toString()}</li>
        </ul>
      </div>
    );
  };

  const handleStartToStake = () => {
    setShowWriteContract(true);
  };


  const queryClient = new QueryClient();

  return (
    <>
      {ready && address ?  (
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <div>
              <ReadContract />
            </div>
          </QueryClientProvider>
          <div id="RULES">
            <h1>Rules</h1>
            <ol>
            <li>Buy CRAZYFROG Coin</li>
            <li>Connect to staking dapp CRAZYFROG Coin</li>
            <li>Approve CRAZYFROG Coin</li>
            <li>Stake CRAZYFROG Coin</li>
            <li>Only one Stake is Aviable for wallet</li>
            <li>Time tu unstake one month from stake</li>
            <li>Every week is possible to witdrawh Rewards or compund Rewards</li>
            <li>If you want make a multiple stake, open new wallet</li>
            <li>For Unstake You must pay the Unstaking Fee: 1.000.000 CRAZYFROG</li>
            <li>Your CRAZYFROG balance: {(CRAZYFROGBalance/1000000000000000000).toFixed(2)}</li>
            </ol>
            <button onClick={handleStartToStake}>Start to Stake</button>
          </div>
          {showWriteContract && <WriteContract />}
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
