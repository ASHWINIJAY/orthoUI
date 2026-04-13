import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RibbonForm.css';
import { FaSave, FaFileExport, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "./config";
import Popup from './Popup';
import Report from './Report';
import { useLoader } from './LoaderContext';
function PrintDN() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { loading, setLoading } = useLoader(); // ✅ Correct - destructure object

  const [columnFilters, setColumnFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showPopup, setShowPopup] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const closeAdminMenu = () => setAdminMenuOpen(false);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const token = localStorage.getItem('jwt_token');
  useEffect(() => {
    
      if (!token) {
       alert('Authentication Error', 'Token not found. Please log in again.');
        return;
      }
   // handleFetch();
  }, []);

  
  const handleFetch = async (note = deliveryNote) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Rep/GenerateReport`, {
        SalesOrderNumber: note
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 200) {
        alert("No data found!");
        return;
      }
  
      if (response.status === 200) {
        const docresponse = await axios.post(`${API_BASE_URL}/Rep/ViewReport`, {
          SalesOrderNumber: note
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'  // Important to get PDF as blob
        });
  
        if (docresponse.status === 200) {
          const file = new Blob([docresponse.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          setPdfUrl(fileURL);        // set URL to state
          setShowReport(true);        // open popup
        } else {
          alert('No data found!');
        }
      }
    } catch (err) {
      console.error(err);
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

  

  return (
    <div className="ribbon-page" onClick={closeAdminMenu}>
      <div className="ribbon-bar">
        <div className="ribbon-buttons">
       
        <button
  type="button"
  className="ribbon-button"
  onClick={() => handleFetch()}
  disabled={loading}
>
  <FaPrint className="icon" /> {loading ? 'Printing...' : 'Print'}
</button>
        </div>
      </div>

      <div className="delivery-note-container">
        <label htmlFor="deliveryNote">Syspro Sales Order Number</label>
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

<Report show={showReport} onClose={() => { setShowReport(false); setPdfUrl(null); }}>
  {pdfUrl ? (
    <iframe
      src={pdfUrl}
      style={{ width: '100%', height: '600px', border: 'none' }}
      title="Delivery Note PDF"
    />
  ) : (
    <p>Loading PDF...</p>
  )}
</Report>

          <button
  className="fetch-button"
  onClick={() => setShowPopup(true)}
  disabled={loading}
>
  🔍 Browse Sales Order Number
</button>
        </div>
      </div>

    </div>
  );
}

export default PrintDN;
