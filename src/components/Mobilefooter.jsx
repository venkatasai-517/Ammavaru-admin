import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import firebaseDB from "../firebase";

export default function Footer() {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      firebaseDB.child("submissions").on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          setSubmissions(Object.values(snapshot.val()));
        }
      });
    };
    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter(
    ({ name, mobileNumber, address, amount }) =>
      [name, mobileNumber, address, amount].some((field) =>
        field ? field.toLowerCase().includes(searchTerm.toLowerCase()) : false
      )
  );

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleSearchClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSearchTerm(""); // Optionally clear the search term when closing
  };

  return (
    <footer className=" p-3 md:hidden">
      {/* Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-black p-3 flex justify-around">
        <Link to="/" className="flex flex-col items-center text-black">
          <i className="bi bi-house"></i>
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to=""
          className="flex flex-col items-center text-black"
          onClick={handleBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span className="text-xs">Left</span>
        </Link>
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center text-black"
        >
          <i className="bi bi-search"></i>
          <span className="text-xs">Search</span>
        </button>
        <Link
          to=""
          className="flex flex-col items-center text-black"
          onClick={handleForward}
        >
          <i className="bi bi-arrow-right"></i>
          <span className="text-xs">Right</span>
        </Link>
        <Link to="/photos" className="flex flex-col items-center text-black">
          <i className="bi bi-plus-circle-dotted"></i>
          <span className="text-xs">Add</span>
        </Link>
      </div>

      {/* Popup for Search Results */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-4 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {searchTerm && filteredSubmissions.length > 0 ? (
              <ul className="space-y-2">
                {filteredSubmissions.map((submission, index) => (
                  <li key={index} className="border-b border-gray-300 py-2">
                    <p>
                      <strong>Name:</strong> {submission.name}
                    </p>
                    <p>
                      <strong>Mobile Number:</strong> {submission.mobileNumber}
                    </p>
                    <p>
                      <strong>Address:</strong> {submission.address}
                    </p>
                    <p>
                      <strong>Amount:</strong> {submission.amount}
                    </p>
                    {submission.file && (
                      <p>
                        <strong>File:</strong>{" "}
                        <a
                          href={submission.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : searchTerm ? (
              <p>No results found.</p>
            ) : (
              <p>Start typing to search.</p>
            )}
            <button
              onClick={handlePopupClose}
              className="mt-4 bg-blue-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
