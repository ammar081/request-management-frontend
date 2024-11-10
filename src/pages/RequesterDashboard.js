import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestForm from "../components/RequestForm";

const RequesterDashboard = ({ user, authHeaders }) => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleRequestSubmit = async (requestData) => {
    try {
      const requestDataWithUserEmail = {
        ...requestData,
        email: user.email,
      };

      // Fetch the token from localStorage if authHeaders isn't defined
      const token = localStorage.getItem("token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : authHeaders;

      // POST request to backend to create a new request with Authorization header
      const response = await axios.post(
        "http://localhost:3005/requests/create",
        requestDataWithUserEmail,
        { headers } // Pass the headers with token
      );
      console.log("Request created successfully:", response.data);

      alert("Request submitted successfully!");
      handleCreateRequest();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to submit the request. Please try again.");
    }
  };

  // Fetch requests for the logged-in user on component mount
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/requests/user-requests",
          {
            headers: authHeaders,
            params: { email: user.email },
          }
        );
        console.log("response: ", response.data);

        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    fetchUserRequests();
  }, [user.email, showForm, authHeaders]);

  const handleCreateRequest = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      {showForm ? (
        <div className="container mx-auto p-8">
          <div className="m-4">
            <button
              onClick={handleCreateRequest}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
            >
              Back
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-6">Requester Dashboard</h1>
          <RequestForm onSubmit={handleRequestSubmit} />
        </div>
      ) : (
        <div className="container mx-auto p-8">
          <div className="flex justify-end">
            <button
              onClick={handleCreateRequest}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
            >
              Create Request
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4">My Requests</h1>
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <ul className="space-y-4">
              {requests?.map((request) => (
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
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        request?.status === "approved"
                          ? "text-green-500"
                          : request.status === "rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {request?.status?.charAt(0).toUpperCase() +
                        request?.status?.slice(1)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default RequesterDashboard;
