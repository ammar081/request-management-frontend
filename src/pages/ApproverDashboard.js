import React, { useEffect, useState } from "react";
import axios from "axios";

const ApproverDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loadingApprove, setLoadingApprove] = useState(null); // Loading state for Approve button
  const [loadingReject, setLoadingReject] = useState(null); // Loading state for Reject button

  // Fetch pending requests on component mount
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/requests/pending-requests"
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  // Handle approving a request
  const handleApprove = async (requestId) => {
    setLoadingApprove(requestId); // Set loading for Approve button
    try {
      await axios.post("http://localhost:3005/requests/approve-request", {
        requestId,
      });
      setRequests(requests.filter((request) => request._id !== requestId));
      alert("Request approved and notifications sent.");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request.");
    } finally {
      setLoadingApprove(null); // Reset loading state for Approve button
    }
  };

  // Handle rejecting a request
  const handleReject = async (requestId) => {
    setLoadingReject(requestId); // Set loading for Reject button
    try {
      await axios.post("http://localhost:3005/requests/reject-request", {
        requestId,
      });
      setRequests(requests.filter((request) => request._id !== requestId));
      alert("Request rejected and notifications sent.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request.");
    } finally {
      setLoadingReject(null); // Reset loading state for Reject button
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Pending Requests for Approval</h1>
      {requests.length === 0 ? (
        <p>No pending requests available.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="border p-4 rounded shadow">
              <p>
                <strong>Title:</strong> {request.title}
              </p>
              <p>
                <strong>Description:</strong> {request.description}
              </p>
              <p>
                <strong>Type:</strong> {request.type}
              </p>
              <p>
                <strong>Urgency:</strong> {request.urgency}
              </p>
              <button
                onClick={() => handleApprove(request._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 mr-2 flex items-center justify-center"
                disabled={
                  loadingApprove === request._id ||
                  loadingReject === request._id
                } // Disable if any button is loading
              >
                {loadingApprove === request._id ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Approve"
                )}
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 flex items-center justify-center"
                disabled={
                  loadingApprove === request._id ||
                  loadingReject === request._id
                } // Disable if any button is loading
              >
                {loadingReject === request._id ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Reject"
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproverDashboard;