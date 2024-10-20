/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FaLeaf } from "react-icons/fa"; // Importing a leaf icon

export const WelcomeSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <div className="flex items-center mb-6">
        <FaLeaf className="text-green-500" size={48} /> {/* Green leaf icon */}
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Welcome to Carbon Wheel</h1>
      <p className="text-lg text-gray-600 text-center mb-6 max-w-xl">
        Earn money by reducing your carbon emissions and saving the planet. 
        Drive an electric vehicle (EV)? Start earning today!
      </p>
      <p className="text-lg text-gray-500 text-center mb-4">
        Connect your wallet to access your dashboard.
      </p>
    </div>
  );
};
