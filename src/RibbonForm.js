import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RibbonForm.css';
import { FaSave, FaFileExport } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "./config";
import Popup from './Popup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoader } from './LoaderContext';

function RibbonForm() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { loading, setLoading } = useLoader(); // ✅ Correct - destructure object
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const [columnFilters, setColumnFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showPopup, setShowPopup] = useState(false);

  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const closeAdminMenu = () => setAdminMenuOpen(false);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('jwt_token');
  useEffect(() => {
    
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);
  //useEffect(() => {
    //handleFetch();
  //}, []);
  const handleSave = async () => {
    setSaving(true);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/save`, {
        data: tableData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        alert('Data saved successfully!');
        handleFetch();
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          // Handle 400 Bad Request with backend message
          alert(`Validation Error: ${error.response.data}`);
        } else {
          alert(`Error: ${error.response.status} - ${error.response.data}`);
        }
      } else if (error.request) {
        alert('No response from server.');
      } else {
        alert('An unexpected error occurred.');
      }
  
      console.error('Save error:', error);
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };
  
  
  const handleFetch = async (note = deliveryNote) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/Saleorderdetails`, {
        SalesOrderNumber: note}, // body
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
      setTableData(response.data.map(row => ({
        ...row,
        visited: false  // add visited flag
      })));
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (tableData.length > 0) {
      // Enable Save if ALL rows have been visited, or if they are read-only (mbomFlag === 'P')
      const allVisited = tableData.some(
        row => row.visited
      );
      setIsSaveEnabled(allVisited);
    } else {
      setIsSaveEnabled(false);
    }
  }, [tableData]);
  
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

  return (
    <div className="ribbon-page" onClick={closeAdminMenu}>
      <div className="ribbon-bar">
        <div className="ribbon-buttons">
        {isSaveEnabled && !saving && (
  <button 
    className="ribbon-button" 
    onClick={handleSave}
  >
    <FaSave className="icon" /> Save
  </button>
)}

{saving && (
  <button className="ribbon-button" disabled>
    <FaSave className="icon" /> Saving...
  </button>
)}


          
        </div>
      </div>

      <div className="delivery-note-container">
        <label htmlFor="deliveryNote">Delivery Note</label>
        <div className="input-button-wrapper">
          <input
            type="text"
            id="deliveryNote"
            name="deliveryNote"
            placeholder="📦 Scan or enter sales order"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            className="delivery-input"
            onKeyPress={handleKeyPress}
          />
        <Popup
  show={showPopup}
  onClose={() => setShowPopup(false)}
  onSelect={(noteNo) => {
    setDeliveryNote(noteNo);
    setTimeout(() => {
      handleFetch(noteNo); // pass the value directly
    }, 1000);
  }}
/>

          <button
  className="fetch-button"
  onClick={() => setShowPopup(true)}
  disabled={loading}
>
  🔍 Browse For Delivery Notes
</button>

          
        </div>
      </div>
      

      {loading && <p>Loading data...</p>}

      <div className="form-content">
        <table className="ortho-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Sno {renderSortArrow('sno')}</th>
              <th>Status {renderSortArrow('status')}</th>
              <th>Syspro Status {renderSortArrow('sysprostatus')}</th>
              <th>Set {renderSortArrow('setsCode')}</th>
              <th>Warehouse {renderSortArrow('mwarehouse')}</th>
              <th>Stock Code {renderSortArrow('mstockCode')}</th>
              <th>Description {renderSortArrow('mstockDes')}</th>
              <th>Qty Required {renderSortArrow('morderQty')}</th>
              <th>Qty Delivered {renderSortArrow('mshipQty')}</th>
              <th>Rep Usage Qty {renderSortArrow('repUsageQty')}</th>
            </tr>
            <tr>
              <th></th>
              {[
                'status', 'sysprostatus', 'setsCode', 'mwarehouse', 'mstockCode',
                'mstockDes', 'morderQty', 'mshipQty', 'repUsageQty'
              ].map(key => (
                <th key={key}>
                  <input
                    type="text"
                    placeholder="Filter"
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.status??"not started"}</td>
                  <td>{item.orderStatus}</td>
                  <td>{item.setsCode}</td>
                  <td>{item.mwarehouse}</td>
                  <td>{item.mstockCode}</td>
                  <td>{item.mstockDes}</td>
                  <td style={{ textAlign: 'right' }}>{item.morderQty}</td>
                  <td style={{ textAlign: 'right' }}>{item.mshipQty}</td>
                  <td style={{ textAlign: 'right' }}>
                  <input
  type="number"
  value={item.repUsageQty??"0"}
  readOnly={item.mbomFlag === 'P'}
  onChange={(e) => {
    const value = e.target.value.trim();
    const maxQty = parseFloat(item.mshipQty) || 0;
    

    // If empty, set to "0"
    
    if (value > maxQty) {
      toast.error('Rep Usage Qty cannot exceed Delivered Qty', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
      return;
    }
    if(value<0)
    {
      toast.error('Qty cannot be negative', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
      return;
    }
    setFilteredData(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, repUsageQty: value } : row
      )
    );
    setTableData(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, repUsageQty: value } : row
      )
    );
  }}
  onBlur={() => {
    setTableData(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, visited: true } : row
      )
    );
  }}
  style={{
    backgroundColor: item.mbomFlag === 'P' ? '#f0f0f0' : 'white',
    cursor: item.mbomFlag === 'P' ? 'not-allowed' : 'text'
  }}
/>

                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>No data available</td></tr>
            )}
          </tbody>
        </table>
        <div className="bottom-save">
  {(isSaveEnabled || saving) && (
    <button 
      className={`ribbon-button full-width ${isSaveEnabled && !saving ? 'visible' : ''}`}
      onClick={handleSave}
      disabled={saving}
    >
      <FaSave className="icon" /> {saving ? 'Saving...' : 'Save'}
    </button>
  )}
</div>


      </div>
      <ToastContainer theme="colored" position="center" />

    </div>
    
  );
}

export default RibbonForm;
