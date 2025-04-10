import React, { useEffect, useState } from "react";
import ComplaintAccordion from "../components/ComplaintAccordion";

const GigHome = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [complaints, setComplaints] = useState([]);
  const getData = async () => {
    const res = await fetch("http://localhost:3000/complaints");
    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(complaints);
  }, [complaints]);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gig Workers</h1>
          <p className="text-gray-600">
            Transforming Complaints into Solutions
          </p>
        </div>
        <button
          className="px-4 py-2 text-white bg-[#1b4965] rounded-lg hover:bg-[#05314B] cursor-pointer"
          onClick={() => {
            alert("Under Development!");
          }}
        >
          New Complaint
        </button>
      </div>

      {/* Tab Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "all"
                ? "border-b-2 border-[#1b4965] font-semibold text-[#1b4965]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Complaints
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "my"
                ? "border-b-2 border-[#1b4965] font-semibold text-[#1b4965]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Complaints
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 ">
          {activeTab === "all" ? (
            <>
              {complaints.length > 0 ? (
                <ComplaintAccordion complaintsData={complaints} />
              ) : null}
            </>
          ) : (
            <p className="text-gray-600">This section is under development</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigHome;
