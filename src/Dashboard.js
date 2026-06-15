import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './RibbonForm.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import API_BASE_URL from './config';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const [period, setPeriod] = useState('currentMonth');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    handleFetch();
  }, [period]);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Rep/GetDashBoard`, {
        params: { period },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        alert("No data found!");
        return;
      }

      setDashboardData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setDashboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const totalOrders = dashboardData.reduce((sum, row) => sum + Number(row?.value || 0), 0);
    const inProgress = dashboardData
      .filter((row) => (row?.name || '').toLowerCase().includes('progress'))
      .reduce((sum, row) => sum + Number(row?.value || 0), 0);
    const completedStatuses = ['repcompleted', 'readytopostsyspro', 'completed&readyforvalidation', 'postedtosyspro'];
    const completedByStatus = completedStatuses.reduce((acc, status) => {
      const matched = dashboardData.find((row) => (row?.name || '').toLowerCase() === status);
      acc[status] = Number(matched?.value || 0);
      return acc;
    }, {});
    const completed = Object.values(completedByStatus).reduce((sum, value) => sum + value, 0);

    return {
      totalOrders,
      inProgress,
      completed,
      completedByStatus
    };
  }, [dashboardData]);

  const pieColors = ['#7c3aed', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

  return (
    <div className="ribbon-page" style={{ padding: '20px', background: 'linear-gradient(180deg, #f8faff 0%, #eef6ff 100%)', minHeight: '100%' }}>
      <h2 style={{ marginBottom: '10px', color: '#1d4ed8' }}>Dashboard</h2>
      <p style={{ marginTop: 0, marginBottom: '20px', color: '#334155' }}>
        Quick summary overview.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="period" style={{ marginRight: '8px', fontWeight: 600 }}>Period:</label>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #93c5fd', backgroundColor: '#ffffff' }}
        >
          <option value="currentMonth">Current Month</option>
          <option value="last7days">Last 7 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', minWidth: '180px', boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)' }}>
              <p style={{ margin: 0, color: '#dbeafe' }}>Total Orders</p>
              <h3 style={{ margin: '8px 0 0', color: '#fff' }}>{summary.totalOrders}</h3>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', minWidth: '180px', boxShadow: '0 8px 18px rgba(20, 184, 166, 0.22)' }}>
              <p style={{ margin: 0, color: '#ccfbf1' }}>In Progress</p>
              <h3 style={{ margin: '8px 0 0', color: '#fff' }}>{summary.inProgress}</h3>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', minWidth: '180px', boxShadow: '0 8px 18px rgba(239, 68, 68, 0.25)' }}>
              <p style={{ margin: 0, color: '#ffedd5' }}>Completed</p>
              <h3 style={{ margin: '8px 0 0', color: '#fff' }}>{summary.completed}</h3>
            </div>
            <div style={{ background: '#fff', color: '#1f2937', border: '1px solid #fed7aa', borderRadius: '12px', padding: '14px', minWidth: '320px', boxShadow: '0 8px 18px rgba(245, 158, 11, 0.12)' }}>
              <p style={{ margin: 0, color: '#9a3412', fontWeight: 600 }}>Completed Status Breakdown</p>
              <div style={{ marginTop: '8px', display: 'grid', gap: '6px' }}>
                <p style={{ margin: 0 }}><strong>Rep Completed:</strong> {summary.completedByStatus.repcompleted}</p>
                <p style={{ margin: 0 }}><strong>Ready To Post Syspro:</strong> {summary.completedByStatus.readytopostsyspro}</p>
                <p style={{ margin: 0 }}><strong>Completed & Ready For Validation:</strong> {summary.completedByStatus['completed&readyforvalidation']}</p>
                <p style={{ margin: 0 }}><strong>Posted To Syspro:</strong> {summary.completedByStatus.postedtosyspro}</p>
              </div>
            </div>
          </div>

          {dashboardData.length > 0 && (
            <div className="charts-container">
              <div className="chart-columns" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px', background: '#fff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '10px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.12)' }}>
                  <h4 style={{ margin: '8px 0 14px' }}>Orders by Status</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dashboardData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                      <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#334155', fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: '#fff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '10px', boxShadow: '0 8px 20px rgba(14, 165, 233, 0.14)', order: 2, marginLeft: 'auto' }}>
                  <h4 style={{ margin: '8px 0 14px' }}>Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={dashboardData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={95}
                        fill="#10b981"
                        label
                      >
                        {dashboardData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {dashboardData.length === 0 && <p>No dashboard data found for the selected period.</p>}
        </>
      )}
    </div>
  );
}

export default Dashboard;
