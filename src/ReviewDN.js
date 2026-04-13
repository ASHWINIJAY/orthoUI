import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RibbonForm.css';
import { FaSave, FaFileExport, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "./config";
import Popup from './Popup';
import { useLoader } from './LoaderContext';
function ReviewDN() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { loading, setLoading } = useLoader(); // ✅ Correct - destructure object

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
       alert('Authentication Error', 'Token not found. Please log in again.');
        return;
      }
   // handleFetch();
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/updatestatus`, {
        data: tableData}, // body
        {
          headers: {
            Authorization: `Bearer ${token}`, // pass token in header
            'Content-Type': 'application/json'
          }        
      });
  
      if (response.status === 200) {
        alert('Data updated successfully!');
        handleFetch();
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };
  
  const handleFetch = async (note = deliveryNote) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/revieworderdetails`, {
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
  const isValidateAllowed = filteredData.some(
    (item) => item.status === 'ReadyToPostSyspro' || 'Send Email To Customer Service' || item.status==='Completed&ReadyForValidation'
  );

  return (
    <div className="ribbon-page" onClick={closeAdminMenu}>
        {isValidateAllowed && (<div className="ribbon-bar">
        <div className="ribbon-buttons">
        
<button className="ribbon-button" onClick={handleSave}>
  <FaUndo className="icon" /> Update Status To InProgress
</button>
        </div>
        </div>
)}
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
              <th>Checked Return Qty {renderSortArrow('retQty')}</th>
              <th>Usage {renderSortArrow('usage')}</th>
              <th>Variance {renderSortArrow('variance')}</th>
            </tr>
            <tr>
              <th></th>
              {[
                'status', 'sysprostatus', 'setsCode', 'mwarehouse', 'mstockCode',
                'mstockDes', 'morderQty', 'mshipQty', 'repUsageQty','retQty','usage',
                'variance'
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
                  <td style={{ textAlign: 'right' }}>{item.repUsageQty}</td>
                  <td style={{ textAlign: 'right' }}>{item.retQty}</td>
                  <td style={{ textAlign: 'right' }}>{item.usage}</td>
                  <td style={{ textAlign: 'right' }}>{item.variance}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>No data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewDN;
