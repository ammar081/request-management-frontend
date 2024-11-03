import React from "react";

const RequestList = ({ requests, onApprove }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Requests</h2>
      <ul>
        {requests.map((request) => (
          <li
            key={request._id}
            className="p-4 border-b border-gray-200 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{request.title}</h3>
              <p>{request.description}</p>
              <p className="text-sm text-gray-500">Status: {request.status}</p>
            </div>
            {request.status === "Pending" && (
              <button
                onClick={() => onApprove(request._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;
