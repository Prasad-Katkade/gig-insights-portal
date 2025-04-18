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
  maintainAspectRatio: false,
};

const PolicyHome = () => {
  const [summary, setSummary] = useState("");
  const [analytics, setAnalytics] = useState({ labels: [], values: [] });
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("vis");

  const [chatMessages, setChatMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFetched = useRef(false);

  const msgSentBySystem = useRef(false);

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

  function splitIntoChunks(sentences, chunkSize = 3) {
    return sentences.map((sentence) => {
      const words = sentence.split(" ");
      const chunks = [];

      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
      }

      return chunks;
    });
  }

  const getAnalytics = async () => {
    const res = await fetch(`${API_URL}/analytics`);
    const data = await res.json();
    const concerns = data.map((item) => item.concern);
    const labels = splitIntoChunks(concerns);
    console.log(labels);

    const values = data.map((item) => item.count);
    setAnalytics({
      // labels: concerns.map((concern, i) => `Concern ${i + 1}: ${concern}`),
      labels,
      values,
    });
  };

  useEffect(() => {
    if (!isFetched.current) {
      getComplaints();
      getSummary();
      getAnalytics();
      isFetched.current = true;
    }
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hey There! \n This is GigInsights Chatbot an AI trained using OpenAI LLM API's prloaded with the data from Reddit complaints. This chat-bot can be used to analyze complaints data and provide a high level overview of the data.",
      },
      {
        role: "system",
        content: "Please Summarise all the complaints for me.",
      },
      {
        role: "system",
        content: "What are the major concerns?",
      },
    ]);
  }, []);

  const chartData = {
    // labels: analytics.labels.map((_, index) => `Concern ${index + 1}`),
    labels: analytics.labels,
    datasets: [
      {
        label: "Importance Score",
        data: analytics.values,
        backgroundColor: "#5fa8d3",
      },
    ],
  };

  const handleChatSubmit = async () => {
    console.log("userPrompt", userPrompt);
    msgSentBySystem.current = false;
    if (!userPrompt.trim()) return;
    setIsLoading(true);
    const updatedMessages = [
      ...chatMessages,
      { role: "user", content: userPrompt },
    ];
    setChatMessages(updatedMessages);
    setUserPrompt("");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();
      setChatMessages([
        ...updatedMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (e) {
      console.log(e);

      setChatMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(msgSentBySystem.current){
      handleChatSubmit()
      const index = chatMessages.findIndex((i)=>i.content===userPrompt)
      console.log(index);
      chatMessages.splice(index,1)
      setChatMessages(chatMessages)
    }
  },[userPrompt])

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
              activeTab === "chat"
                ? "border-b-2 border-[#1b4965] font-semibold text-[#1b4965]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
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
        <div className="mt-4">
          {activeTab === "vis" && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-[#1b4965]">
                  AI Overview of 50 Complaints
                </h1>
                <p className="mt-2 text-md">
                  {summary ? summary : "Loading..."}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <h1 className="text-2xl font-bold text-[#1b4965]">
                  Major Concerns
                </h1>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-9">
                    {analytics.labels.length > 0 ? (
                      <Bar
                        options={options}
                        data={chartData}
                        height={400}
                        width={600}
                      />
                    ) : (
                      "Loading..."
                    )}
                  </div>
                  {/* <div className="col-span-3 mt-4">
                    {analytics.labels.map((item, idx) => (
                      <p key={idx} className="text-sm font-bold text-[#1b4965] mb-2">
                        {item}
                      </p>
                    ))}
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === "chat" && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner min-h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-screen flex flex-col w-full">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`w-full flex ${
                      msg.role === "user" || msg.role === "system"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg  ${
                        msg.role === "user"
                          ? "bg-blue-100 text-right w-[75%]"
                          : msg.role === "system"
                          ? "bg-[#1b4965] hover:bg-[#1b2932] text-white text-right"
                          : "bg-white border text-left w-[75%]"
                      }`}
                      onClick={() => {
                        msgSentBySystem.current = true;
                        if (msg.role === "system") {
                          setUserPrompt(msg.content);
                        }
                      }}
                    >
                      {msg.role === "system"?`Suggestion: ${msg.content}`:msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="w-full flex justify-start">
                    <div className="p-3 rounded-lg w-[75%] bg-white border text-left italic text-gray-500">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ask about complaints..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      msgSentBySystem.current = false;
                      handleChatSubmit();
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => {
                    msgSentBySystem.current = false;
                    handleChatSubmit();
                  }}
                  className="px-4 py-2 bg-[#1b4965] text-white rounded-lg disabled:opacity-50"
                  disabled={isLoading}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === "my" && complaints.length > 0 && (
            <ComplaintAccordion complaintsData={complaints} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyHome;
