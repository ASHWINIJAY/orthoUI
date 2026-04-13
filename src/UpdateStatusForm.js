import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import "./UpdateStatusForm.css";
import { useLoader } from "./LoaderContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import Popup from "./Popup";

function UpdateStatusForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const { loading, setLoading } = useLoader();

  const [salesOrderNumber, setSalesOrderNumber] = useState("");
  const [showCorrectionPopup, setShowCorrectionPopup] = useState(false);
  const [showBrowsePopup, setShowBrowsePopup] = useState(false);
  const [selectedCorrectionType, setSelectedCorrectionType] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleReEnterSalesOrder = () => {
    setShowCorrectionPopup(true);
    setSelectedCorrectionType(null);
    setConfirmationMessage("");
    setErrorMessage("");
    setSalesOrderNumber("");
    setOrderDetails(null);
  };

  const handleCorrectionTypeSelect = async (type) => {
    setSelectedCorrectionType(type || null);
    setErrorMessage("");

    if (salesOrderNumber.trim()) {
      await fetchOrderDetails(salesOrderNumber);
    }
  };

  const fetchOrderDetails = async (orderNumber) => {
    if (!orderNumber.trim()) {
      setErrorMessage("Please enter a Sales Order Number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Rep/Saleorderdetails`,
        { SalesOrderNumber: orderNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.length > 0) {
        setOrderDetails(response.data[0]);
        setErrorMessage("");
      } else {
        setOrderDetails(null);
        setErrorMessage("No order found with this Sales Order Number");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails(null);
      setErrorMessage("Error fetching order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalesOrderChange = async (e) => {
    const value = e.target.value;
    setSalesOrderNumber(value);
    setErrorMessage("");

    if (value.trim()) {
      await fetchOrderDetails(value);
    } else {
      setOrderDetails(null);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedCorrectionType) {
      setErrorMessage("Please select a correction type");
      return;
    }

    if (!salesOrderNumber.trim()) {
      setErrorMessage("Please enter a Sales Order Number");
      return;
    }

    if (!orderDetails) {
      setErrorMessage("Please enter a valid Sales Order Number");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        salesOrderNumber: salesOrderNumber,
        correctionType: selectedCorrectionType,
      };

      const response = await axios.post(
        `${API_BASE_URL}/Rep/AdminUpdateOrderStatus`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setConfirmationMessage(
          `✅ Order ${salesOrderNumber} has been updated and routed to ${
            selectedCorrectionType === "repclerk" ? "Rep Clerk" : "Rep"
          } successfully!`
        );
        setShowCorrectionPopup(false);
        setShowBrowsePopup(false);
        setErrorMessage("");
        setOrderDetails(null);
        setSalesOrderNumber("");
        setSelectedCorrectionType(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error updating status. Please try again."
      );
      setConfirmationMessage("");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowCorrectionPopup(false);
    setSelectedCorrectionType(null);
    setConfirmationMessage("");
    setErrorMessage("");
    setOrderDetails(null);
  };

  return (
    <div className="update-status-wrapper">
      <div className="update-status-header">
        <button
          className="back-button"
          onClick={() => navigate("/Users")}
        >
          <FaArrowLeft /> Back
        </button>
        <h2>Update Status - Re-Enter/Correct Sales Order</h2>
      </div>

      <div className="update-status-content">
        <div className="instruction-card">
          <div className="instruction-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Correct Sales Order Entry</h3>
          <p>
            Use this form to correct sales order entries and route them back to
            the appropriate role for re-entry or correction.
          </p>
          <button
            className="reenter-button"
            onClick={handleReEnterSalesOrder}
            disabled={loading}
          >
            🔄 Re-Enter/Correct Sales Order
          </button>
        </div>

        {confirmationMessage && (
          <div className="confirmation-message">
            {confirmationMessage}
          </div>
        )}
      </div>

      {/* Correction Popup Modal */}
      {showCorrectionPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="correction-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Re-Enter/Correct Sales Order</h3>
              <button className="close-popup" onClick={closePopup}>
                ×
              </button>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label>Sales Order Number *</label>
                <div className="input-with-browse">
                  <input
                    type="text"
                    value={salesOrderNumber}
                    onChange={handleSalesOrderChange}
                    placeholder="Enter Sales Order Number"
                    className="form-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="browse-button"
                    onClick={() => setShowBrowsePopup(true)}
                    disabled={loading}
                  >
                    🔍 Browse
                  </button>
                </div>
                <Popup
                  show={showBrowsePopup}
                  onClose={() => setShowBrowsePopup(false)}
                  onSelect={(noteNo) => {
                    setSalesOrderNumber(noteNo);
                    setShowBrowsePopup(false);
                    fetchOrderDetails(noteNo);
                  }}
                  title="Browse Sales Orders"
                />
              </div>

              {orderDetails && (
                <div className="order-details-card">
                  <h4>Order Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{orderDetails.customer || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{orderDetails.status || "Not Started"}</span>
                  </div>
                  
                </div>
              )}

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <div className="correction-options">
                <h4>Select Correction Type *</h4>
                <select
                  value={selectedCorrectionType || ""}
                  onChange={(e) => handleCorrectionTypeSelect(e.target.value)}
                  className="form-input"
                  disabled={loading}
                >
                  <option value="">Select correction type</option>
                  <option value="repclerk">
                    Correct Rep Clerk Entry - Route back to Rep Clerk
                  </option>
                  <option value="rep">
                    Correct Rep Entry - Route back to Rep
                  </option>
                </select>
              </div>

              <div className="popup-actions">
                <button
                  className="cancel-button"
                  onClick={closePopup}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="update-button"
                  onClick={handleUpdateStatus}
                  disabled={loading || !selectedCorrectionType || !salesOrderNumber.trim()}
                >
                  {loading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateStatusForm;
