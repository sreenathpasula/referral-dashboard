import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const BASE_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";
const ROWS_PER_PAGE = 10;

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [referral, setReferral] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);

  // isFirstLoad = true means first time opening page (show full loading)
  // isFirstLoad = false means search/sort (only show table loading)
  async function fetchData(
    searchVal = "",
    sortVal = "desc",
    isFirstLoad = false
  ) {
    if (isFirstLoad) setLoading(true);
    else setTableLoading(true);
    setError("");
    try {
      const token = Cookies.get("jwt_token");
      const params = new URLSearchParams();
      if (searchVal) params.set("search", searchVal);
      if (sortVal) params.set("sort", sortVal);
      const url = BASE_URL + (params.toString() ? "?" + params.toString() : "");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || `Error ${res.status}`);
        setLoading(false);
        setTableLoading(false);
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
    setTableLoading(false);
  }

  // First load passes isFirstLoad = true
  useEffect(() => {
    fetchData("", "desc", true);
  }, []);

  const searchTimeout = React.useRef(null);

  function handleSearch(e) {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchData(val, sort, false);
    }, 500);
  }

  function handleSort(e) {
    const val = e.target.value;
    setSort(val);
    setPage(1);
    fetchData(search, val, false);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  function formatDate(d) {
    return d ? d.replace(/-/g, "/") : "";
  }

  function formatProfit(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const totalRows = referrals.length;
  const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const currentRows = referrals.slice(startIndex, startIndex + ROWS_PER_PAGE);
  const fromCount = totalRows === 0 ? 0 : startIndex + 1;
  const toCount = Math.min(startIndex + ROWS_PER_PAGE, totalRows);

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 text-left">
        <h1 className="!text-2xl font-bold mb-1" style={{ color: "#1e1b4b" }}>
          Referral Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {/* Full page loading - only on first load */}
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && (
          <p role="alert" className="text-red-500 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* All sections - only hidden on first load */}
        {!loading && !error && (
          <>
            {/* OVERVIEW */}
            <section
              role="region"
              aria-label="Overview metrics"
              className="bg-white rounded-xl shadow p-6 mt-6 mb-6"
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#1e1b4b" }}
              >
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 p-6 gap-4">
                {metrics.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-lg p-4 text-center shadow-md"
                  >
                    <p className="text-2xl font-bold text-indigo-900">
                      {m.value}
                    </p>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {m.label}
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
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "#1e1b4b" }}
                >
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
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "#1e1b4b" }}
                >
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

            {/* ALL REFERRALS TABLE */}
            <section className="bg-white rounded-xl shadow p-6 mb-6">
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#1e1b4b" }}
              >
                All referrals
              </h2>

              <div className="flex flex-wrap gap-4 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Name or service…"
                  value={search}
                  onChange={handleSearch}
                  aria-label="Search referrals"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[220px]"
                />
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  Sort by date:
                  <select
                    value={sort}
                    onChange={handleSort}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              {/* Table with subtle loading overlay on search */}
              <div className="overflow-x-auto relative">
                {tableLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                    <p className="text-indigo-600 font-semibold text-sm">
                      Searching...
                    </p>
                  </div>
                )}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-gray-600 font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-3 text-gray-600 font-semibold">
                        Service
                      </th>
                      <th className="px-4 py-3 text-gray-600 font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-gray-600 font-semibold">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-400"
                        >
                          No matching entries
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => navigate(`/referral/${row.id}`)}
                          className="border-t border-gray-100 hover:bg-indigo-50 cursor-pointer transition"
                        >
                          <td className="px-4 py-3 text-gray-800">
                            {row.name}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {row.serviceName}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {formatDate(row.date)}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {formatProfit(row.profit)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalRows > 0 && (
                <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                  <span className="text-sm text-gray-500">
                    Showing {fromCount}–{toCount} of {totalRows} entries
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={`px-3 py-1 border rounded-lg text-sm ${
                            num === page
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>

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
