import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, YAxis, XAxis, PieChart, Pie, Cell, Legend } from "recharts";
import Cookies from "js-cookie";

const SurveyStats = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [resStats, resList] = await Promise.all([
        fetch(`${apiUrl}/api/survey/stats`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }),
        fetch(`${apiUrl}/api/survey?limit=10`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }),
      ]);
      const dataStats = await resStats.json();
      const dataList = await resList.json();
      if (dataStats?.success) setStats(dataStats);
      if (dataList?.success) setItems(dataList.items || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full p-3 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Thống kê khảo sát</h1>
      {loading && <p>Đang tải...</p>}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Charts Row */}
          <div className="p-3 rounded border shadow md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-72">
              <h3 className="font-semibold mb-2">Biểu đồ cột: Điểm đến</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byDestination?.map((x) => ({ name: x._id || "Khác", value: x.count }))}>
                  <Tooltip />
                  <YAxis />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72">
              <h3 className="font-semibold mb-2">Biểu đồ tròn: Thể loại du lịch</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 80, bottom: 0, left: 0 }}>
                  <Pie
                    dataKey="value"
                    data={stats.byTravelType?.map((x) => ({ name: x._id || "Khác", value: x.count }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    labelLine={false}
                  >
                    {(stats.byTravelType || []).map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ lineHeight: "24px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-3 rounded border shadow">
            <h2 className="font-semibold mb-2">Tổng quan</h2>
            <p>Tổng khảo sát: {stats.summary?.totalSurveys || 0}</p>
            <p>Tổng số người: {stats.summary?.totalPersons || 0}</p>
            <p>Thời gian ở trung bình: {Math.round(stats.summary?.avgStay || 0)} ngày</p>
          </div>
          <div className="p-3 rounded border shadow">
            <h2 className="font-semibold mb-2">Theo phương tiện</h2>
            <ul className="list-disc list-inside">
              {stats.byTransportation?.map((x) => (
                <li key={x._id}>{x._id || "Khác"}: {x.count}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded border shadow">
            <h2 className="font-semibold mb-2">Theo thể loại</h2>
            <ul className="list-disc list-inside">
              {stats.byTravelType?.map((x) => (
                <li key={x._id}>{x._id || "Khác"}: {x.count}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded border shadow md:col-span-3">
            <h2 className="font-semibold mb-2">Điểm đến phổ biến</h2>
            <div className="flex flex-wrap gap-2">
              {stats.byDestination?.map((x) => (
                <span key={x._id} className="px-3 py-1 bg-slate-100 rounded border">
                  {x._id || "Khác"}: {x.count}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
      {!loading && (
        <div className="p-3 rounded border shadow">
          <h2 className="font-semibold mb-2">Khảo sát gần đây</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Địa điểm</th>
                  <th className="py-2 pr-4">Ngày ở</th>
                  <th className="py-2 pr-4">Phương tiện</th>
                  <th className="py-2 pr-4">Số người</th>
                  <th className="py-2 pr-4">Thể loại</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{it.destination}</td>
                    <td className="py-2 pr-4">{it.stayDurationDays}</td>
                    <td className="py-2 pr-4">{it.transportation}</td>
                    <td className="py-2 pr-4">{it.numPersons}</td>
                    <td className="py-2 pr-4">{it.travelType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyStats;
