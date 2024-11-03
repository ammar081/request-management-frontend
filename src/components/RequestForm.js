import React, { useState } from "react";

const RequestForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Leave");
  const [urgency, setUrgency] = useState("Low");
  const [superiorEmail, setSuperiorEmail] = useState(""); // New state for superior's email
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    // Wait for the onSubmit function to complete
    await onSubmit({
      title,
      description,
      type,
      urgency,
      superiorEmail,
    });

    setLoading(false); // Hide loading spinner
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Request</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        >
          <option value="Leave">Leave</option>
          <option value="Equipment">Equipment</option>
          <option value="Overtime">Overtime</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Urgency</label>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Superior's Email Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Superior's Email</label>
        <input
          type="email"
          value={superiorEmail}
          onChange={(e) => setSuperiorEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          "Submit Request"
        )}
      </button>
    </form>
  );
};

export default RequestForm;
