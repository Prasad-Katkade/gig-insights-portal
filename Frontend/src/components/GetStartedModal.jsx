import React from "react";
import { useNavigate } from "react-router";

const GetStartedModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-sepia-0">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg border-gray-300 border-2">
        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-4">Get started</h2>

        {/* Buttons Section */}
        <div className="flex gap-4 mb-4">
          {/* Drivers Button */}
          <button
            onClick={() => {
              navigate("/Gigworkers");
            }}
            className="flex flex-col items-center justify-center w-1/2 p-4 text-white bg-[#1b4965] rounded-lg hover:bg-[#05314B] cursor-pointer"
          >
            <span className="text-2xl">🚗</span>
            <span className="mt-2 text-sm">
              Drivers <br /> (Gig workers)
            </span>
          </button>

          {/* Policy Makers Button */}
          <button
            onClick={() => {
              navigate("/Policymakers");
            }}
            className="flex flex-col items-center justify-center w-1/2 p-4 text-white bg-[#1b4965] rounded-lg hover:bg-[#05314B] cursor-pointer"
          >
            <span className="text-2xl">📜</span>
            <span className="mt-2 text-sm">Policy Makers</span>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          className="w-full py-2 text-gray-700 border border-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GetStartedModal;
