/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { nftabi } from "~~/contracts/nftAbi";
import { ethers } from "ethers";

export const NFTSection = () => {
  const { isConnected, address } = useAccount(); // Get the connected wallet address
  const [nfts, setNfs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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
    <div className="min-h-screen bg-gray-100 py-5">
      <h2 className="text-3xl font-bold text-center mb-8">My Carbon Credit NFTs</h2>

      <div className="max-w-6xl mx-auto">
        {/* Loading State */}
        {loading && <p className="text-center text-blue-600">Loading your NFTs...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* No Wallet Connected */}
        {!isConnected && <p className="text-center text-yellow-600">Please connect your wallet</p>}

        {/* Grid Layout for NFT Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading &&
            nfts.length > 0 &&
            nfts.map((nyNft, i) => (
              <div key={i} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Carbon Credit NFT #{i + 1}</h3>
                <p className="text-gray-700 text-lg mb-6">You have {nyNft.toString()} Carbon Credits</p>

                <div className="flex justify-between space-x-2">
                  <button className="bg-green-500 text-white hover:bg-green-600 rounded-md py-2 px-4 w-full">
                    Sell
                  </button>
                  <button className="bg-blue-500 text-white hover:bg-blue-600 rounded-md py-2 px-4 w-full">
                    Pool
                  </button>
                  <button className="bg-purple-500 text-white hover:bg-purple-600 rounded-md py-2 px-4 w-full">
                    Trade
                  </button>
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
