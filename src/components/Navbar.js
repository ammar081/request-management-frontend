import React from "react";

const Navbar = ({ user, onLogin, onLogout }) => {
  console.log("user: ", user);
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold">
        Request Management System
      </h1>
      <div>
        {user ? (
          <>
            <span className="text-white mr-4">Hello, {user.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
