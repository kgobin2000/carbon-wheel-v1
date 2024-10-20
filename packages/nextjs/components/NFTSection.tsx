/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { nftabi } from "~~/contracts/nftAbi";
import { ethers } from "ethers";
import { FaLeaf, FaEthereum, FaRecycle, FaQuestionCircle } from "react-icons/fa"; // Importing icons

export const NFTSection = () => {
  const { isConnected, address } = useAccount(); // Get the connected wallet address
  const [nfts, setNfs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [soldNfts, setSoldNfts] = useState({}); // Track which NFTs have been sold

  // Query the smart contract for NFTs
  async function querySmartContract() {
    try {
      setLoading(true); // Start loading
      // Connect to the Ethereum network
      const provider = new ethers.JsonRpcProvider(
        "https://testnet.evm.nodes.onflow.org/"
      );

      // The address of the smart contract
      const contractAddress = "0x5af399Cf2784dFec0aA2c91D33229bF4a69a5C95";

      // Create a new contract instance
      const contract = new ethers.Contract(contractAddress, nftabi, provider);

      // Call the contract's balanceOf function asynchronously
      const userAddress = address; // Replace with the actual address
      const balance = await contract.balanceOf(userAddress);

      const cc = [];
      for (let i = 0; i < balance; i++) {
        const ccnew = await contract.getCarbonCredits(i);
        cc.push(ccnew);
      }
      setNfs(cc);
      setLoading(false); // End loading
    } catch (error) {
      // setError("Error querying contract"); // Set error
      querySmartContract()
      setLoading(false); // End loading
      console.error("Error querying contract:", error);
    }
  }

  // Simulate sale of NFT
  const handleSimulateSell = (index: number, originalCredits: number) => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const ethAmount = 0.00038* randomNumber*originalCredits*50; // Simulated ETH deposited
    const soldFor = randomNumber; // Simulate selling for double the original estimate
    const localAmout = ethAmount * 2600;

    setSoldNfts((prevSoldNfts) => ({
      ...prevSoldNfts,
      [index]: {
        message: `Your carbon credit was sold for ${randomNumber} times the original estimate! ${ethAmount} ETH (~ $${localAmout} USD) has been deposited into your account.`,
        soldFor,
        ethAmount,
        txHash: "0x123abc...", // Simulate a transaction hash
      },
    }));
  };

  // UseEffect to query the contract once the component is mounted
  useEffect(() => {
    if (isConnected) {
      querySmartContract();
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-900">My Carbon Credits</h2>

      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && <p className="text-center text-blue-600">Loading your Credits...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* No Wallet Connected */}
        {!isConnected && <p className="text-center text-yellow-600">Please connect your wallet</p>}

      {/* Explanation Section */}
<div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 mb-6 shadow-md flex items-center relative">
  <h3 className="text-lg font-semibold">
    All NFTs are currently pending sale.{" "}
    <span className="ml-2 relative group">
      <FaQuestionCircle className="inline-block cursor-pointer" />
      {/* Tooltip */}
      <div className="absolute hidden group-hover:block w-64 bg-gray-700 text-white text-sm rounded-lg p-2 mt-2 z-10">
        Once NFTs are in pending sale, they are locked for sale in a pool. You will be reimbursed once the sale completes.
      </div>
    </span>
  </h3>
</div>

        {/* Flex Layout for NFT Cards */}
        <div className="flex flex-wrap -mx-4">
          {!loading &&
            nfts.length > 0 &&
            nfts.map((nyNft, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-8"
              >
                <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transform hover:scale-105 transition-transform">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">NFT</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {nyNft.toString()} Carbon Credit(s)
                  </p>

                  {/* Check if the NFT has been sold and display message */}
                  {soldNfts[i] ? (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg text-sm mb-4">
                      {soldNfts[i].message}
                      {/* Button to view the transaction on Etherscan */}
                      <a
                        href={`https://etherscan.io/tx/${soldNfts[i].txHash}`} // Link to the simulated transaction hash
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-blue-600 underline"
                      >
                        View on Etherscan
                      </a>
                    </div>
                  ) : (
                    <div className="flex justify-between space-x-4">
                      <button
                        className="flex items-center justify-center bg-gray-300 text-gray-500 rounded-lg py-2 px-4 w-full cursor-not-allowed"
                        disabled
                      >
                        <FaLeaf className="mr-2" /> Pending Sale
                      </button>
                    </div>
                  )}

                  {/* Simulate Sell Button */}
                  {!soldNfts[i] && (
                    <button
                      onClick={() =>
                        handleSimulateSell(i, parseFloat(nyNft.toString()))
                      }
                      className="mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg py-2 px-4 w-full"
                    >
                      Simulate Sell
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* No NFTs found */}
        {!loading && !error && nfts.length === 0 && isConnected && (
          <p className="text-center text-gray-600">No NFTs found</p>
        )}
      </div>
    </div>
  );
};
