import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RibbonForm.css';
import { FaSave, FaFileExport } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import API_BASE_URL from "./config";

function Dashboard() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const closeAdminMenu = () => setAdminMenuOpen(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/Saleorderdetails`, {
        SalesOrderNumber: ""}, // body
        {
          headers: {
            Authorization: `Bearer ${token}`, // pass token in header
            'Content-Type': 'application/json'
          }        
      });

      if (response.status !== 200) {
        alert("No data found!");
        return;
      }

      setTableData(response.data);
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFetch();
    }
  };

  const handleFilterChange = (key, value) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let filtered = tableData.filter(item =>
      Object.keys(columnFilters).every(key => {
        const filterVal = columnFilters[key]?.toLowerCase() || '';
        const itemVal = (item[key] ?? '').toString().toLowerCase();
        return itemVal.includes(filterVal);
      })
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = (a[sortConfig.key] ?? '').toString();
        const bVal = (b[sortConfig.key] ?? '').toString();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [tableData, columnFilters, sortConfig]);

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return '⬍';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  return (
    <div className="ribbon-page" onClick={closeAdminMenu}>
      {loading && <p>Loading data...</p>}

      {filteredData.length > 0 && (
        <div className="charts-container">
          <h3>Dashboard Charts</h3>
          <div className="chart-columns" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Bar Chart Column */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>Order Quantity by Stock Code</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mstockCode" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="morderQty" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Column */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>Shipment Quantity Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    dataKey="mshipQty"
                    nameKey="mstockCode"
                    outerRadius={100}
                    fill="#82ca9d"
                    label
                  >
                    {filteredData.map((entry, index) => (
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

    </div>
  );
}

export default Dashboard;
