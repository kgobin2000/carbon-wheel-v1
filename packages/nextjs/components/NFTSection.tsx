/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

export const NFTSection = () => {
  const { targetNetwork } = useTargetNetwork(); // Gets the target network details
  const [newGreeting, setNewGreeting] = useState(""); // State for the new greeting
  const [transactionStatus, setTransactionStatus] = useState(""); // State to track transaction status

  const {
    data: currentGreeting,
    isError,
    isLoading,
    refetch: refetchGreeting,
  } = useScaffoldReadContract({ contractName: "HelloWorld", functionName: "hello" });

  const { writeContractAsync: writeYourContractAsync, isPending } = useScaffoldWriteContract("HelloWorld");

  const changeGreeting = async () => {
    try {
      const res = await writeYourContractAsync({
        functionName: "changeGreeting",
        args: [newGreeting],
      });
      await refetchGreeting();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <h2>NFT Section</h2>

      {/* Display current greeting */}
      {isLoading && <p>Loading greeting...</p>}
      {isError && <p>Error loading greeting!</p>}
      {currentGreeting && <p>Greeting from contract: {currentGreeting}</p>}

      <div>
        <input
          type="text"
          placeholder="Enter new greeting"
          value={newGreeting}
          onChange={e => setNewGreeting(e.target.value)}
        />
        <button onClick={changeGreeting} disabled={isPending}>
          Change Greeting
        </button>
      </div>
    </div>
  );
};
