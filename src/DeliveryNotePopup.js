// src/components/DeliveryNotePopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config'; // adjust path if needed

function DeliveryNotePopup({ show, onClose, onSelect }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    if (!show) return;

    setLoading(true);
    axios.get(`${API_BASE_URL}/Rep/GetDeliveryNotes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotes(res.data || []))
    .catch(err => {
      console.error('Error fetching delivery notes', err);
      setNotes([]);
    })
    .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Select Delivery Note</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Delivery Note</th>
                <th className="border px-3 py-2">Order Date</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {notes.length > 0 ? (
                notes.map((note, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-2">{note.SalesOrderNumber}</td>
                    <td className="border px-3 py-2">{note.OrderDate}</td>
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => {
                          onSelect(note.SalesOrderNumber);
                          onClose();
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">No delivery notes found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryNotePopup;
