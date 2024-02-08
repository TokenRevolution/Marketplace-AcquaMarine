import React, { useState } from 'react';
import { useContractWrite } from 'wagmi'
import abi from '../abi.json';
const WriteContract = () => {
  const { data, isLoading, isSuccess, write, mutate } = useContractWrite({
    address: '0x32a215fF4Bcee940fB8e281C1FF2aE58D92Cc022',
    abi: abi,
    functionName: 'claimReward',
  })
  

  return (
    <div>
      <button onClick={() => write({})}>Claim</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div >
  );
};

const App = () => {
  return (
    <WriteContract />
  );
};

export default App;
