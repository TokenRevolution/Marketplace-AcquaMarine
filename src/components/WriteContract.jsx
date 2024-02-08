import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import stakingAbi from './stakingAbi.json';
import abi from './abi.json';

const WriteContract = () => {
  const [amountD, setAmountD] = useState('');
  const [amountS, setAmountS] = useState('');
  const [showProceed, setShowProceed] = useState(false);

  const { data: approveData, isLoading: isApproveLoading, isSuccess: isApproveSuccess, write: writeApprove } = useContractWrite({
    address: '0x9f57ae6Fd0102b6880C9497502bEe7248919662D',
    abi: abi,
    functionName: 'approve',
    chainId: 97, // Inserisci l'ID della chain corretta
  });
  

  const { data: stakeData, isLoading: isStakeLoading, isSuccess: isStakeSuccess, write: writeStake } = useContractWrite({
    address: '0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b',
    abi: stakingAbi,
    chainId: 97, // Inserisci l'ID della chain corretta
  });

  const handleProceed = () => {
    setShowProceed(true);
  };

  const handleStake = () => {
    const amountstake = amountS * 1000000000000000000;
    writeStake({
      functionName: 'stake',
      args: [amountstake],
    });
  };

  const handleUnstake = () => {
    writeStake({
      functionName: 'unstake',
      args: [],
    });
  };

  const handleWithdrawReward = () => {
    writeStake({
      functionName: 'withdrawReward',
      args: [],
    });
  };

  const handleCompoundRewards = () => {
    writeStake({
      functionName: 'compoundRewards',
      args: [],
    });
  };

  const handleApproveStake = () => {
    writeApprove({
      args: ['0xBa242443aE89E16fd5d61Acee8D33B5142ad2d6b', 100], // Inserisci l'indirizzo del contratto di stake corretto e l'importo desiderato
    });
  };

  return (
    <div id="writecontact">
      {isApproveSuccess ? (
        <>
          <input id="stake" type="number" value={amountS} onChange={(e) => setAmountS(e.target.value)} />
          <button className="writeButton" onClick={handleStake}>
            Stake
          </button>
        </>
      ) : (
        <button className="writeButton" onClick={handleApproveStake}>
          Approve Stake
        </button>
      )}
      {!showProceed && (
        <button className="writeButton" onClick={handleProceed}>
          Check Others Options
        </button>
      )}
      {isStakeLoading && <div>Loading contract...</div>}
      {isStakeSuccess && <div>Transaction: {JSON.stringify(stakeData)}</div>}
      {showProceed && !isStakeLoading && !isStakeSuccess && (
        <div>
          <button className="writeButton" onClick={handleUnstake}>
            Unstake
          </button>
          <button className="writeButton" onClick={handleWithdrawReward}>
            Withdraw Reward
          </button>
          <button className="writeButton" onClick={handleCompoundRewards}>
            Compound Rewards
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <WriteContract />
    </QueryClientProvider>
  );
};

export default App;