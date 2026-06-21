import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const BASE_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";

function ReferralDetailPage() {
  // useParams reads the :id from the URL
  // example: /referral/5 → id = "5"
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const token = Cookies.get("jwt_token");
        const res = await fetch(`${BASE_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        const data = json.data || json;

        // Case 1: API returns the row directly in data
        if (data && data.id && String(data.id) === String(id)) {
          setReferralData(data);
        }
        // Case 2: API returns a referrals array
        else if (data && Array.isArray(data.referrals)) {
          const found = data.referrals.find((r) => String(r.id) === String(id));
          found ? setReferralData(found) : setNotFound(true);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }

    fetchDetail();
  }, [id]);

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

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {loading && <p className="text-gray-500">Loading...</p>}

        {/* NOT FOUND */}
        {!loading && notFound && (
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Referral not found
            </h2>
            <Link
              to="/"
              className="text-indigo-600 font-semibold hover:underline"
            >
              ← Back to dashboard
            </Link>
          </div>
        )}

        {/* REFERRAL DETAIL */}
        {!loading && referralData && (
          <div className="bg-white rounded-xl shadow p-8">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "#1e1b4b" }}
            >
              Referral Details
            </h1>
            <h2 className="text-lg text-indigo-600 font-semibold mb-6">
              {referralData.name}
            </h2>

            {/* Definition list - label + value rows */}
            <dl className="divide-y divide-gray-100">
              <div className="flex py-3">
                <dt className="w-40 text-sm font-semibold text-gray-500">
                  Referral ID
                </dt>
                <dd className="text-sm text-gray-800">{referralData.id}</dd>
              </div>
              <div className="flex py-3">
                <dt className="w-40 text-sm font-semibold text-gray-500">
                  Service Name
                </dt>
                <dd className="text-sm text-gray-800">
                  {referralData.serviceName}
                </dd>
              </div>
              <div className="flex py-3">
                <dt className="w-40 text-sm font-semibold text-gray-500">
                  Date
                </dt>
                <dd className="text-sm text-gray-800">
                  {formatDate(referralData.date)}
                </dd>
              </div>
              <div className="flex py-3">
                <dt className="w-40 text-sm font-semibold text-gray-500">
                  Profit
                </dt>
                <dd className="text-sm text-gray-800">
                  {formatProfit(referralData.profit)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                to="/"
                className="text-indigo-600 font-semibold hover:underline text-sm"
              >
                ← Back to dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferralDetailPage;
