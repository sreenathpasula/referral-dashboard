import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Cookies from "js-cookie";

const API_LOGIN =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (Cookies.get("jwt_token")) return <Navigate to="/" replace />;

  async function handleSignIn() {
    setError("");
    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.data?.token) {
        Cookies.set("jwt_token", json.data.token);
        navigate("/");
      } else {
        setError(json.message || "Invalid email or password");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-left">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "#723EC3" }}>
          Go Business
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Sign in to open your referral dashboard.
        </p>

        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignIn}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
