import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const BASE_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [referral, setReferral] = useState(null);
  const [referrals, setReferrals] = useState([]);

  async function fetchData(search = "", sort = "desc") {
    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("jwt_token");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      const url = BASE_URL + (params.toString() ? "?" + params.toString() : "");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || `Error ${res.status}`);
        setLoading(false);
        return;
      }

      const json = await res.json();
      const data = json.data || json;
      setMetrics(data.metrics || []);
      setServiceSummary(data.serviceSummary || null);
      setReferral(data.referral || null);
      setReferrals(data.referrals || []);
    } catch {
      setError("Failed to load data.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold text-indigo-900 mb-1">
          Referral Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && (
          <p role="alert" className="text-red-500 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* OVERVIEW */}
            <section
              role="region"
              aria-label="Overview metrics"
              className="bg-white rounded-xl shadow p-6 mb-6"
            >
              <h2 className="text-lg font-bold text-indigo-900 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((m) => (
                  <div
                    key={m.id}
                    className="bg-indigo-50 rounded-lg p-4 text-center"
                  >
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {m.label}
                    </p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SERVICE SUMMARY */}
            {serviceSummary && (
              <section
                aria-label="Service summary"
                className="bg-white rounded-xl shadow p-6 mb-6"
              >
                <h2 className="text-lg font-bold text-indigo-900 mb-4">
                  Service summary
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-2 text-gray-600 font-semibold">
                          Service
                        </th>
                        <th className="px-4 py-2 text-gray-600 font-semibold">
                          Your Referrals
                        </th>
                        <th className="px-4 py-2 text-gray-600 font-semibold">
                          Active Referrals
                        </th>
                        <th className="px-4 py-2 text-gray-600 font-semibold">
                          Total Ref. Earnings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-gray-800">
                          {serviceSummary.service}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {serviceSummary.yourReferrals}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {serviceSummary.activeReferrals}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {serviceSummary.totalRefEarnings}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SHARE REFERRAL */}
            {referral && (
              <section
                aria-label="Share referral"
                className="bg-white rounded-xl shadow p-6 mb-6"
              >
                <h2 className="text-lg font-bold text-indigo-900 mb-4">
                  Refer friends and earn more
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Your Referral Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={referral.link}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(referral.link)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Your Referral Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={referral.code}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(referral.code)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-indigo-900 text-indigo-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <span className="text-white font-bold">Go Business</span>
          <nav aria-label="Footer">
            <a
              href="#about"
              className="text-indigo-200 hover:text-white text-sm mr-4"
            >
              About
            </a>
            <a
              href="#privacy"
              className="text-indigo-200 hover:text-white text-sm"
            >
              Privacy
            </a>
          </nav>
          <span className="text-sm">© 2024 Go Business</span>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;
