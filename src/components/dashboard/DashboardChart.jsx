import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchCompaniesByMonth,
  fetchRevenueByMonth,
  fetchUserTypeRatio,
  fetchJobsByMonth
} from "@/api/stats";

const chartTitles = {
  overview: "Overview Chart",
  users: "User Type Ratio",
  jobs: "Jobs By Month",
  reports: "Reported Companies By Month",
  company: "Company By Month",
  revenue: "Revenue By Month"
};

const COLORS = ["#22c55e", "#3b82f6", "#f59e42", "#ef4444", "#a21caf", "#eab308"];

const DashboardChart = ({ type }) => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        if (type === "overview" || type === "company") {
          const companiesByMonth = await fetchCompaniesByMonth(token);
          if (!ignore) setData(Array.isArray(companiesByMonth) ? companiesByMonth : []);
        } else if (type === "revenue") {
          const revenueByMonth = await fetchRevenueByMonth(token);
          if (!ignore) setData(Array.isArray(revenueByMonth) ? revenueByMonth : []);
        } else if (type === "users") {
          const userTypeRatio = await fetchUserTypeRatio(token);
          const pieData = Object.entries(userTypeRatio).map(([type, value]) => ({ name: type, value }));
          if (!ignore) setData(pieData);
        } else if (type === "jobs") {
          const jobsByMonth = await fetchJobsByMonth(token);
          if (!ignore) setData(Array.isArray(jobsByMonth) ? jobsByMonth : []);
        } else {
          setData([]);
        }
      } catch (err) {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [type, token]);

  // Company chart (overview, company)
  if (type === "overview" || type === "company") {
    return (
      <div style={{ width: "100%", height: "260px" }}>
        {loading ? (
          <div style={{ color: "#a3a3a3", textAlign: "center", marginTop: 80 }}>Loading chart...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: 80 }}>{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Array.isArray(data) ? data : []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Companies" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // Revenue chart
  if (type === "revenue") {
    return (
      <div style={{ width: "100%", height: "260px" }}>
        {loading ? (
          <div style={{ color: "#a3a3a3", textAlign: "center", marginTop: 80 }}>Loading chart...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: 80 }}>{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Array.isArray(data) ? data : []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" name="Revenue" stroke="#f59e42" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // Users chart (pie chart)
  if (type === "users") {
    return (
      <div style={{ width: "100%", height: "260px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div style={{ color: "#a3a3a3" }}>Loading chart...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // Jobs chart (line chart)
  if (type === "jobs") {
    return (
      <div style={{ width: "100%", height: "260px" }}>
        {loading ? (
          <div style={{ color: "#a3a3a3", textAlign: "center", marginTop: 80 }}>Loading chart...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: 80 }}>{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Array.isArray(data) ? data : []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Jobs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // Placeholder cho các tab khác
  return (
    <div
      style={{
        width: "100%",
        height: "260px",
        background: "#f9fafb",
        border: "2px dashed #a3a3a3",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a3a3a3",
        fontSize: "1.5rem"
      }}
    >
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{marginRight: 12}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 11V7m-4 8v-4m-4 4v-2" />
      </svg>
      [{chartTitles[type] || "Chart"} Placeholder]
    </div>
  );
};

export default DashboardChart; 