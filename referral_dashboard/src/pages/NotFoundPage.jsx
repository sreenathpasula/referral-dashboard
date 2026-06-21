import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans text-center">
      <h1 className="text-8xl font-extrabold" style={{ color: "#1e1b4b" }}>
        404
      </h1>
      <p className="text-xl text-gray-500 mt-4 mb-6">Page not found</p>
      <Link
        to="/"
        className="text-indigo-600 font-semibold hover:underline text-sm"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
