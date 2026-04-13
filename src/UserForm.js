import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import "./UserForm.css";
import API_BASE_URL from "./config";
import axios from "axios";
import { useLoader } from './LoaderContext';
function UserForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  const [salespersons, setSalespersons] = useState([]);
  const [defaultclerks, setDefaultClerks] = useState([]);
  const { loading, setLoading } = useLoader(); // ✅ Correct - destructure object

  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Rep/GetSalesArea`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSalespersons(response.data); // Assuming API returns an array
      } catch (error) {
        console.error("Error fetching salesArea:", error);
      }
    };
  
    fetchSalespersons();
  }, []);
  
  useEffect(() => {
    const fetchDefaultClerks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Rep/GetClerks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDefaultClerks(response.data); // Assuming API returns an array
      } catch (error) {
        console.error("Error fetching Clerks:", error);
      }
    };
  
    fetchDefaultClerks();
  }, []);
  
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "",
    customeremail:"",
    defaultRouteClerk:"",
    area: [],
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/createuser`, {
        method: "POST", // body
       
          headers: {
            Authorization: `Bearer ${token}`, // pass token in header
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          firstname: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
          roles: user.roles,
          area: user.area,
          customeremail: user.customeremail,
          defaultRouteClerk: user.defaultRouteClerk,
        })
      });

      
      if(response.status === 200)
      {
      //const data = await response.json();

      alert("✅ User created successfully!");
     // console.log("API Response:", data);

      setUser({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        roles: "",
        area: [],
        customeremail:"",
        defaultRouteClerk:"",
      });
    }
    else
    {
        const data = await response.json();
        //console.error("Error:", data.message);
        //const data = await response.json();
        alert(data.message);
    }
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    }
    finally
    {
      setLoading(false);
    }
  };
  function MultiSelectDropdown({ options, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOption = (value) => {
      const newSelected = selected?.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(newSelected);
    };
  
    return (
      <div className="userform-group">
        <label>Syspro Area</label>
        <div className="multiselect-wrapper">
          <div className="dropdown-box" onClick={() => setIsOpen((prev) => !prev)}>
            {selected?.length > 0
              ? options
                  .filter((sp) => selected?.includes(sp.area))
                  .map((sp) => sp.area)
                  .join(", ")
              : "Select Area(s)"}
          </div>
          {isOpen && (
            <div className="multiselect-dropdown">
            {options.map((sp) => (
              <label key={sp.area} className="checkbox-option">
                <input
                  type="checkbox"
                  value={sp.area}
                  checked={selected?.includes(sp.area)}
                  onChange={() => toggleOption(sp.area)}
                />
                <span>{sp.description} ({sp.area})</span>
              </label>
            ))}
          </div>
          
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="user-form-wrapper">
      {/* Ribbon */}
      <div className="ribbon">
        <h2>User Management</h2>
        <div className="ribbon-buttons">
          <button onClick={() => navigate("/form")}>🏠 Home</button>
          <button onClick={handleSave}>💾 Save</button>
        </div>
      </div>

      {/* Form */}
      <form className="userform-form" onSubmit={handleSave}>
        <div className="userform-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="userform-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="userform-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="userform-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="userform-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="userform-group">
          <label>Role</label>
          <select name="roles" value={user.roles} onChange={handleChange} required>
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="rep">Rep</option>
            <option value="repclerk">Rep Clerk</option>
          </select>
        </div>
        {user.roles === "rep" && (
  <>
    <MultiSelectDropdown
      options={salespersons}
      selected={user.area}
      onChange={(selectedValues) =>
        setUser((prev) => ({ ...prev, area: selectedValues }))
      }
    />
    <div className="userform-group">
      <label>Route to clerk</label>
      <select
        name="defaultRouteClerk"
        value={user.defaultRouteClerk || ""}
        onChange={handleChange}
        required
      >
        <option value="">Select Receiving Clerk</option>
        {defaultclerks.map((sp) => (
          <option key={sp.username} value={sp.username}>
            {sp.username}
          </option>
        ))}
      </select>
    </div>
  </>
)}

{user.roles === "repclerk" && (
    <div className="userform-group">
          <label>Customer Service Email(Multiple seperate by comma)</label>
          <input
            type="text"
            name="customeremail"
            value={user.customeremail}
            onChange={handleChange}
            required
          />
        </div>
)}
      </form>
    </div>
  );
}

export default UserForm;
