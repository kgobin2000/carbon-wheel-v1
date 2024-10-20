/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { contractABI } from "./abis";
import { useWriteContract } from "wagmi";
import { useReadContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export const NFTSection = () => {
  const { targetNetwork } = useTargetNetwork(); // Gets the target network details
  const [newGreeting, setNewGreeting] = useState(""); // State for the new greeting
  const [transactionStatus, setTransactionStatus] = useState(""); // State to track transaction status

  // Contract address (replace with your deployed contract's address)
  const contractAddress = "0x93aBfCd5e9c847110D85127305242d9c38d4f987";

  // Reading the `hello()` function from the contract using `useContractRead`
  const {
    data: currentGreeting,
    isError,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "hello",
    chainId: targetNetwork.id,
  }) as any;

  const { data: hash, writeContract, isPending } = useWriteContract({});

  const changeGreeting = async () => {
    try {
      setTransactionStatus("Transaction in progress...");

      const res = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "changeGreeting",
        args: [newGreeting],
        chainId: targetNetwork.id,
      });

      console.log("Transaction successful", res);
      setTransactionStatus("Greeting updated successfully!");

      // Optionally, you can trigger a re-fetch of the current greeting after updating
      // This could be done by refetching the current greeting or setting a timeout to wait for the blockchain to update
    } catch (error) {
      console.error("Transaction failed", error);
      setTransactionStatus("Error updating greeting");
    }
  };

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <h2>NFT Section</h2>

      {/* Display current greeting */}
      {isLoading && <p>Loading greeting...</p>}
      {isError && <p>Error loading greeting!</p>}
      {currentGreeting && <p>Greeting from contract: {currentGreeting}</p>}

      {/* Input and button to update the greeting */}
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

      {/* Display transaction status */}
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};
