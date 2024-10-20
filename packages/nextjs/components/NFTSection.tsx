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

  // Query the smart contract for NFTs
  async function querySmartContract() {
    try {
      setLoading(true); // Start loading
      // Connect to the Ethereum network
      const provider = new ethers.JsonRpcProvider(
        "https://testnet.evm.nodes.onflow.org/"
      );

      // The address of the smart contract
      const contractAddress = "0x5cfDe4EA6D48E51fDB0433d6F7d26113890A842a";

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
      setError("Error querying contract"); // Set error
      setLoading(false); // End loading
      console.error("Error querying contract:", error);
    }
  }

  // UseEffect to query the contract once the component is mounted
  useEffect(() => {
    if (isConnected) {
      querySmartContract();
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-900">My Carbon Credit NFTs</h2>

      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && <p className="text-center text-blue-600">Loading your NFTs...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* No Wallet Connected */}
        {!isConnected && <p className="text-center text-yellow-600">Please connect your wallet</p>}

        {/* Explanation Section */}
        <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 mb-6 shadow-md flex items-center">
          <h3 className="text-lg font-semibold">
            All NFTs are currently pending sale.{" "}
            <span className="ml-2">
              <FaQuestionCircle
                className="inline-block"
                title="Once NFTs are in pending sale, they are locked for sale in a pool. You will be reimbursed once the sale completes."
              />
            </span>
          </h3>
        </div>

        {/* Grid Layout for NFT Cards */}
        <div className="flex flex-wrap -mx-4">
  {!loading &&
    nfts.length > 0 &&
    nfts.map((nyNft, i) => (
      <div
        key={i}
        className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-8" // Responsive width: 2 cards per row on small, 3 on large, 4 on extra-large
      >
        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transform hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">NFT</h3>
          <p className="text-gray-600 text-lg mb-6">{nyNft.toString()} Carbon Credit(s)</p>

          <div className="flex justify-between space-x-4">
            <button
              className="flex items-center justify-center bg-gray-300 text-gray-500 rounded-lg py-2 px-4 w-full cursor-not-allowed"
              disabled
            >
              <FaLeaf className="mr-2" /> Pending Sale
            </button>
          </div>
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
