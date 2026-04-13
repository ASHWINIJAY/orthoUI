import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popup.css';
import API_BASE_URL from './config'; // adjust as needed

function Popup({ show, onClose, onSelect, title = 'Browse Delivery Notes' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    salesOrder: '',
    customer: '',
    status: ''
  });

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(`${API_BASE_URL}/Rep/GetDeliveryNotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setData(response.data || []);
    } catch (err) {
      console.error("Failed to fetch delivery notes:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: e.target.value.toLowerCase()
    }));
  };

  const filteredData = data.filter(item =>
    item.salesOrder?.toLowerCase().includes(filters.salesOrder) &&
    item.customer?.toLowerCase().includes(filters.customer) &&
    (item.status ?? "not started").toLowerCase().includes(filters.status)
  );

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close" onClick={onClose}>×</button>
        </div>

        <div className="popup-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="popup-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SalesOrderNumber</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <th></th>
                  <th>
                    <input
                      type="text"
                      value={filters.salesOrder}
                      onChange={(e) => handleFilterChange(e, 'salesOrder')}
                      placeholder="Filter"
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      value={filters.customer}
                      onChange={(e) => handleFilterChange(e, 'customer')}
                      placeholder="Filter"
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      value={filters.status}
                      onChange={(e) => handleFilterChange(e, 'status')}
                      placeholder="Filter"
                    />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.salesOrder}</td>
                      <td>{item.customer}</td>
                      <td>{item.status ?? "not started"}</td>
                      <td>
                        <button
                          onClick={() => {
                            onSelect(item.salesOrder);
                            onClose();
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No data found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
