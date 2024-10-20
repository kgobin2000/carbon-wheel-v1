/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import containerStyles from "../styles/Container.module.css";
import { useAccount } from "wagmi";
import { NFTSection } from "~~/components/NFTSection";

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

export default function Home() {
  const [vehicleMake, setVehicleMake] = useState("Smart Car");
  const [vehicleModel, setVehicleModel] = useState("Alpha");
  const [milesAccrued, setMilesAccrued] = useState(2000);
  const [yearBought, setYearBought] = useState(2020);
  const [carbonCredits, setCarbonCredits] = useState<number>(0);
  const [potentialEarnings, setPotentialEarnings] = useState<number>(0);
  const [transactionId, setTransactionId] = useState(null);

  const { address, isConnected } = useAccount();

  // Price per carbon credit
  const creditPrice = 50;

  // Calculate Carbon Credits based on miles
  useEffect(() => {
    const calculateCarbonCredits = (miles: number): number => {
      const emissionPerMile = 404; // in grams (average for gas vehicles)
      const totalEmissions = miles * emissionPerMile; // in grams
      const metricTons = totalEmissions / 1_000_000; // convert to metric tons
      const credits = metricTons; // 1 carbon credit = 1 metric ton CO2
      return parseFloat(credits.toFixed(2)); // returns a formatted value
    };

    const credits = calculateCarbonCredits(milesAccrued);
    setCarbonCredits(credits);
    setPotentialEarnings(credits * creditPrice); // Calculate potential earnings
  }, [milesAccrued]);

  const claimCarbonCredits = async () => {
    alert("You are about to claim credits");
    console.log("Alert: You are about to mint credits");
  };

  return (
    <>
      {isConnected ? (
        <>
          <div className={containerStyles.dashboardContainer}>
            <h2 className={containerStyles.dashboardTitle}>EV User Dashboard</h2>

            <div className={containerStyles.dashboardContent}>
              <div className={containerStyles.smartCarContainer}>
                <Image
                  src="/car.jpg" // Replace with your image path
                  alt="Smart Car"
                  className={containerStyles.smartCarImage}
                  width={600}
                  height={400}
                />
              </div>

              <div className={containerStyles.infoSection}>
                <ul className={containerStyles.vehicleDetailsList}>
                  <li className={containerStyles.vehicleDetailItem}>
                    <strong>Vehicle Make:</strong> {vehicleMake}
                  </li>
                  <li className={containerStyles.vehicleDetailItem}>
                    <strong>Vehicle Model:</strong> {vehicleModel}
                  </li>
                  <li className={containerStyles.vehicleDetailItem}>
                    <strong>Year Bought:</strong> {yearBought}
                  </li>
                  <li className={containerStyles.vehicleDetailItem}>
                    <strong>Miles Accrued:</strong>
                    <span className={containerStyles.milesAccruedHighlight}>{milesAccrued} miles</span>
                  </li>
                </ul>

                <div className={containerStyles.carbonCreditsSection}>
                  <h3>Carbon Credits Available</h3>
                  <p>
                    Based on your mileage, you are eligible to claim{" "}
                    <span className={containerStyles.creditsHighlight}>{carbonCredits}</span> carbon credits.
                  </p>

                  <h3>Potential Earnings</h3>
                  <p>
                    You could earn <span className={containerStyles.creditsHighlight}>${potentialEarnings}</span> from
                    selling your carbon credits (1 CC = $50).
                  </p>
                  <button onClick={claimCarbonCredits} className={containerStyles.claimButton}>
                    Claim Carbon Credits
                  </button>
                </div>
              </div>
            </div>
          </div>
          <NFTSection />
        </>
      ) : (
        <p>Please connect your wallet to view the dashboard.</p>
      )}
    </>
  );
}
