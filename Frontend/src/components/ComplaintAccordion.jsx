import React, { useState } from 'react'

const ComplaintAccordion = ({complaintsData}) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
  
    // Handle accordion toggle
    const handleAccordionToggle = (index) => {
      setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
  
    // Pagination logic
    const itemsPerPage = 10;
    const paginatedComplaints = complaintsData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const totalPages = Math.ceil(complaintsData.length / itemsPerPage);
  
    return (
      <div className="w-full mx-auto bg-white p-4 rounded-md ">
      
        
        {/* Complaint Items */}
        <div>
          {paginatedComplaints.map((complaint, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => handleAccordionToggle(index)}
              >
                <div>
                  <h3 className="text-lg text-[#1b4965] font-bold">{complaint.complaintTitle}</h3>
                  <p className="text-sm text-gray-500">
                    <strong>{complaint.name}</strong> | {complaint.date} | {complaint.location}
                  </p>
                </div>
                <svg
                  id={`icon-${index}`}
                  className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div
                className={`p-4 text-gray-700 transition-all duration-300 ${activeIndex === index ? "block" : "hidden"}`}
              >
                {complaint.desc}
              </div>
            </div>
          ))}
        </div>
  
        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            className="px-4 py-2 bg-[#1b4965] text-white rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="self-center text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            className="px-4 py-2 bg-[#1b4965] text-white rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
}

export default ComplaintAccordion