"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { NFTSection } from "~~/components/NFTSection";
import { WelcomeSection } from "~~/components/WelcomeSection";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { FaCarSide, FaTachometerAlt, FaCalendarAlt, FaGasPump, FaQuestionCircle } from "react-icons/fa"; // Icons for vehicle details

export default function Home() {
  const [vehicleMake, setVehicleMake] = useState("Smart Car");
  const [vehicleModel, setVehicleModel] = useState("Alpha");
  const [milesAccrued, setMilesAccrued] = useState(3000);
  const [yearBought, setYearBought] = useState(2020);
  const [carbonCredits, setCarbonCredits] = useState<number>(0);
  const [potentialEarnings, setPotentialEarnings] = useState<number>(0);
  const [showNFTs, setShowNFTs] = useState(false); // Toggle between views
  const [hasNFTs, setHasNFTs] = useState(false); // Check if the user has NFTs
  const [showCalcInfo, setShowCalcInfo] = useState(false); // Show calculation info

  const { address, isConnected } = useAccount();
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("NFT");

  // Price per carbon credit
  const creditPrice = 50;

  // Calculate Carbon Credits based on miles
  useEffect(() => {
    const calculateCarbonCredits = (miles: number): number => {
      const emissionPerMile = 404; // in grams (average for gas vehicles)
      const totalEmissions = miles * emissionPerMile; // in grams
      const metricTons = totalEmissions / 1_000_000; // convert to metric tons
      const credits = metricTons; // 1 carbon credit = 1 metric ton CO2
      return Math.floor(credits);
    };

    const credits = calculateCarbonCredits(milesAccrued);
    setCarbonCredits(credits);
    setPotentialEarnings(credits * creditPrice); // Calculate potential earnings
  }, [milesAccrued]);

  const claimCarbonCredits = async () => {
    await writeYourContractAsync({
      functionName: "mintCarbonCreditNFT",
      args: [address, BigInt(carbonCredits), "https://example.com/token/metadata.json"],
    });
  };

  // Read contract to check if the user has NFTs
  const { data: userNFTBalance } = useScaffoldReadContract({
    contractName: "NFT",
    functionName: "balanceOf",
    args: [address],
  });

  // Update hasNFTs flag based on the user's balance
  useEffect(() => {
    if (userNFTBalance && userNFTBalance.toString() > 0) {
      setHasNFTs(true);
    } else {
      setHasNFTs(false);
    }
  }, [userNFTBalance]);

  return (
    <div className="min-h-screen bg-gray-100 py-5">
      {isConnected ? (
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">EV User Dashboard</h2>

          {/* Toggle between dashboard and NFTs */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowNFTs(false)}
              className={`px-4 py-2 mr-2 ${!showNFTs ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-md`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowNFTs(true)}
              className={`px-4 py-2 ${showNFTs ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-md`}
            >
              My NFTs
            </button>
          </div>

          {/* Uniform Height for Both Views */}
          <div className="min-h-[500px] bg-white shadow-lg rounded-lg p-6 flex items-center justify-center">
            {/* EV Dashboard View */}
            {!showNFTs && (
              <div className="w-full h-full flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                  <Image
                    src="/car.jpg"
                    alt="Smart Car"
                    className="rounded-lg"
                    width={600}
                    height={400}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <ul className="grid grid-cols-1 gap-4">
                    <li className="flex items-center bg-blue-100 p-4 rounded-lg">
                      <FaCarSide className="text-blue-500 mr-4" size={24} />
                      <div>
                        <strong>Vehicle Make:</strong> {vehicleMake}
                      </div>
                    </li>
                    <li className="flex items-center bg-blue-100 p-4 rounded-lg">
                      <FaTachometerAlt className="text-blue-500 mr-4" size={24} />
                      <div>
                        <strong>Vehicle Model:</strong> {vehicleModel}
                      </div>
                    </li>
                    <li className="flex items-center bg-blue-100 p-4 rounded-lg">
                      <FaCalendarAlt className="text-blue-500 mr-4" size={24} />
                      <div>
                        <strong>Year Bought:</strong> {yearBought}
                      </div>
                    </li>
                    <li className="flex items-center bg-blue-100 p-4 rounded-lg">
                      <FaGasPump className="text-blue-500 mr-4" size={24} />
                      <div>
                        <strong>Miles Accrued:</strong>{" "}
                        <span className="text-blue-500 font-bold">{milesAccrued} miles</span>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Carbon Credits Available</h3>
                    <p className="text-gray-700">
                      Based on your mileage, you are eligible to claim{" "}
                      <span className="font-bold text-blue-600">{carbonCredits}</span> carbon credits.
                    </p>
                  </div>

                  <div className="mt-2 text-sm text-gray-500 cursor-pointer flex items-center" onClick={() => setShowCalcInfo(!showCalcInfo)}>
                    <FaQuestionCircle className="mr-2" />
                    <span>How is this calculated?</span>
                  </div>
                  {showCalcInfo && (
                    <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-md">
                      <p>1 mile driven generates approximately 404 grams of CO2 emissions, based on average gas vehicle emissions.</p>
                      <p>This means for every 1,000 miles driven, you generate approximately 0.404 metric tons of CO2.</p>
                      <p>1 Carbon Credit = 1 Metric Ton of CO2, so your credits are calculated based on this conversion.</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Potential Earnings</h3>
                    <p className="text-gray-700">
                      You could earn{" "}
                      <span className="font-bold text-green-600">${potentialEarnings}</span> from selling
                      your carbon credits (1 CC = $50).
                    </p>
                  </div>

                  <button
                    onClick={claimCarbonCredits}
                    className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                    disabled={!carbonCredits}
                  >
                    Claim Carbon Credits
                  </button>
                </div>
              </div>
            )}

            {/* My NFTs View */}
            {showNFTs && (
              <div className="w-full h-full">
                {hasNFTs ? (
                  <NFTSection />
                ) : (
                  <p className="text-center text-gray-500">You don't have any NFTs yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <WelcomeSection/>  
        )}
    </div>
  );
}
