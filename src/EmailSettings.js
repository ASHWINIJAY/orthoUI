import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmailForm.css";
import API_BASE_URL from "./config"; // Adjust path if needed

function EmailSettings() {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    signature: "",
    cc: "",
    bcc: "",
    smtpServer: "",
    portNumber: "",
    fromAddress: "",
    password: "",
  });

  const [showSMTP, setShowSMTP] = useState(false);
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/email/GetEmailSettings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setFormData((prevData) => ({
          ...prevData,
          subject: data.subject || "",
          body: data.body || "",
          signature: data.signature || "",
          cc: data.cc || "",
          bcc: data.bcc || "",
          smtpServer: data.smtpServer || "",
          portNumber: data.portNumber || "",
          fromAddress: data.fromAddress || "",
          password: data.password || "",
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch email settings:", error);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Conditionally send only SMTP fields if checkbox is checked
    const payload = showSMTP
      ? formData
      : {
          subject: formData.subject,
          body: formData.body,
          signature: formData.signature,
          cc: formData.cc,
          bcc: formData.bcc,
          smtpServer: formData.smtpServer,
          portNumber: formData.portNumber,
          fromAddress:formData.fromAddress,
          password:formData.password,
        };

    axios
      .post(`${API_BASE_URL}/email/EmailSettings`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Settings saved successfully:", response.data);
        alert("Email settings saved successfully!");
      })
      .catch((error) => {
        console.error("Failed to save email settings:", error);
        alert("Failed to save email settings.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="email-form">
      <div>
        <label>Email Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter email subject"
        />
      </div>

      <div>
        <label>Email Body</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Enter email body"
        />
      </div>

      <div>
        <label>Email Signature</label>
        <textarea
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          placeholder="Enter email signature"
        />
      </div>

      <div>
        <label>CC</label>
        <input
          type="text"
          name="cc"
          value={formData.cc}
          onChange={handleChange}
          placeholder="e.g., cc@example.com, user2@example.com"
        />
      </div>

      <div>
        <label>BCC</label>
        <input
          type="text"
          name="bcc"
          value={formData.bcc}
          onChange={handleChange}
          placeholder="e.g., bcc@example.com"
        />
      </div>

      

        <div className="smtp-box">
          <h3>SMTP Configuration</h3>

          <div>
            <label>SMTP Server</label>
            <input
              type="text"
              name="smtpServer"
              value={formData.smtpServer}
              onChange={handleChange}
              placeholder="e.g., smtp.mailserver.com"
            />
          </div>

          <div>
            <label>Port Number</label>
            <input
              type="number"
              name="portNumber"
              value={formData.portNumber}
              onChange={handleChange}
              placeholder="e.g., 587"
            />
          </div>

          <div>
            <label>From Address</label>
            <input
              type="email"
              name="fromAddress"
              value={formData.fromAddress}
              onChange={handleChange}
              placeholder="e.g., noreply@yourdomain.com"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter SMTP password"
            />
          </div>
        </div>
 

      <button type="submit">Save Setting</button>
    </form>
  );
}

export default EmailSettings;
