import React from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useContractRead } from 'wagmi';
import abi from '../abi.json';

const ReadContract = () => {
  const { data, isError, isLoading } = useContractRead({
    address: '0x32a215ff4bcee940fb8e281c1ff2ae58d92cc022',
    abi: abi,
    functionName: 'claimedRewards',
    args: ['0x30C7576dE57822A064AD5709df60c4A8C462f62e'],
  });

  const queryClient = new QueryClient();

  const { data: queryData, isLoading: queryIsLoading, error: queryError } = useQuery(
    'contractData',
    () => {
      // Simulate an asynchronous data fetch
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    { enabled: !isLoading && !isError } // Only run the query if there is no loading or error from useContractRead
  );

  if (isLoading || queryIsLoading) {
    return <p>Loading...</p>;
  }

  if (isError || queryError) {
    return <p>Error occurred while fetching data.</p>;
  }
var res =parseFloat(queryData);
  return (
    <div>
      <p>Rewards Ricevuti: {res}</p>
    </div>
  );
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>My App</h1>
        <ReadContract />
      </div>
    </QueryClientProvider>
  );
};

export default App;
