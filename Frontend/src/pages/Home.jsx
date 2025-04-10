import React, { useState } from "react";
import banner from "../assets/banner.png";
import GetStartedModal from "../components/GetStartedModal";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className=" w-full min-h-screen p-4 grid grid-cols-12">
        <div className="sm:col-span-12 col-span-6  p-12 flex flex-col justify-center">
          <p className="text-[40px] text-center">
            Your Voice, Our AI <br /> Empowering Gig Workers
          </p>
          <p className="text-lg mt-4 text-center">
            Transforming Complaints into Solutions
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1b4965] text-white text-lg p-4 mt-4 rounded-2xl w-full hover:bg-[#05314B] cursor-pointer"
          >
            Get Started
          </button>
        </div>
        <div className="col-span-6  p-12 flex flex-col justify-center">
          <img src={banner} className="h-96 w-full" alt="banner"></img>
        </div>
      </div>
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Home;
