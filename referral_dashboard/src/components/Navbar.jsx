import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    Cookies.remove("jwt_token");
    navigate("/login");
  }

  return (
    <nav className="bg-indigo-900 text-white px-8 py-4 flex items-center justify-between">
      <Link
        to="/"
        aria-label="Go to dashboard home"
        className="text-xl font-bold text-white no-underline"
      >
        Go Business
      </Link>
      <div className="flex items-center gap-6">
        <nav aria-label="Primary">
          <Link to="/" className="text-indigo-200 hover:text-white text-sm">
            Home
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="border border-indigo-300 text-indigo-200 hover:text-white hover:border-white text-sm px-4 py-1 rounded-lg transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
