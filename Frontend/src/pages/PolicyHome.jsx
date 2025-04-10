import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ComplaintAccordion from "../components/ComplaintAccordion";
import { API_URL } from "../Constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
};

const PolicyHome = () => {
  const [summary, setSummary] = useState("");
  const [analytics, setAnalytics] = useState({ labels: [], values: [] });
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("vis");

  const getComplaints = async () => {
    const res = await fetch(`${API_URL}/complaints`);
    const data = await res.json();
    setComplaints(data);
  };
  const getSummary = async () => {
    const res = await fetch(`${API_URL}/summary`);
    const data = await res.json();
    setSummary(data.summary);
  };

  const getAnalytics = async () => {
    const res = await fetch(`${API_URL}/analytics`);
    const data = await res.json();
    const concerns = data.map((item) => item.concern);
    const values = data.map((item) => item.count);
    setAnalytics({
      labels: concerns.map((concern, i) => `Concern ${i + 1}: ${concern}`),
      values,
    });
  };
  const isFetched = useRef(false);
  useEffect(() => {
   if (!isFetched.current) {
    getComplaints();
    getSummary();
    getAnalytics();
    isFetched.current = true;
  }
  }, []);

  const chartData = {
    labels: analytics.labels.map((_, index) => `Concern ${index + 1}`),
    datasets: [
      {
        label: "Driver's concerns",
        data: analytics.values,
        backgroundColor: "#5fa8d3",
      },
    ],
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, Policy Makers
          </h1>
          <p className="text-gray-600">
            Transforming Complaints into Solutions Using AI Tools
          </p>
        </div>
        {/* <button
          className="px-4 py-2 text-white bg-[#1b4965] rounded-lg hover:bg-[#05314B] cursor-pointer"
          onClick={() => {
            alert("Under Development!");
          }}
        >
          New Complaint
        </button> */}
      </div>
      {/* Tab Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "vis"
                ? "border-b-2 border-[#1b4965] font-semibold text-[#1b4965]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("vis")}
          >
            AI Overview
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "my"
                ? "border-b-2 border-[#1b4965] font-semibold text-[#1b4965]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("my")}
          >
           All Complaints
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 ">
          {activeTab === "vis" ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-[#1b4965]">
                  AI Overview of Complaints -{" "}
                </h1>
                <p className="mt-2 text-md">
                  {summary ? summary : "Loading..."}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <h1 className="text-2xl font-bold text-[#1b4965]">
                  Major Concerns -{" "}
                </h1>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    {analytics.labels.length > 0 ? (
                      <Bar options={options} data={chartData} />
                    ) : (
                      "Loading..."
                    )}
                  </div>
                  <div className="col-span-6 mt-4">
                    {analytics.labels.length > 0 &&
                      analytics.labels.map((item) => (
                        <p className="text-sm font-bold text-[#1b4965] mb-2">
                          {item}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {complaints.length > 0 ? (
                <ComplaintAccordion complaintsData={complaints} />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyHome;
