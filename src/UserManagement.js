import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import "./UserManagement.css";
import { useLoader } from './LoaderContext';
import { useNavigate } from "react-router-dom";
import { FaSyncAlt } from "react-icons/fa";

function UserManagement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const [users, setUsers] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [defaultclerks, setDefaultClerks] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const { loading, setLoading } = useLoader(); // ✅ Correct - destructure object


  const [user, setUser] = useState({
    firstname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "",
    salesperson: "",
    customeremail: "",
    defaultRouteClerk: "",
    area:[]
  });

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    fetchSalespersons();
    fetchDefaultClerks();
    setLoading(false);
  }, []);
const [columnFilters, setColumnFilters] = useState({
  firstname: "",
  username: "",
  email: "",
  roles: "",
  salesperson: "",
  defaultRouteClerk: "",
  area:[]
});

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/GetAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSalespersons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Rep/GetSalesArea`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalespersons(response.data);
    } catch (error) {
      console.error("Error fetching salesarea:", error);
    }
  };

  const fetchDefaultClerks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Rep/GetClerks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDefaultClerks(response.data);
    } catch (error) {
      console.error("Error fetching Clerks:", error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEdit = (u) => {
    console.log("Editing User", u);
console.log("Parsed Area", Array.isArray(u.areas) ? u.areas : typeof u.areas === "string" ? u.areas.split(',').map(x => x.trim()) : []);

    setUser({
      firstname: u.firstName,
      username: u.username,
      email: u.email,
      password: "",
      confirmPassword: "",
      roles: u.roles,
      salesperson: u.salesperson || "",
      customeremail: u.customerEmail || "",
      defaultRouteClerk: u.defaultRouteClerk || "",
      area: u.areas,

    });
    setEditingUserId(u.id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setUser({
      firstname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: "",
      salesperson: "",
      customeremail: "",
      defaultRouteClerk: "",
      area:[],
    });
    setIsAreaOpen(false);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    const url = editingUserId
      ? `${API_BASE_URL}/user/updateuser`
      : `${API_BASE_URL}/user/updateuser`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: user.firstname,
          username: user.username,
          email: user.email,
          password: "",
          roles: user.roles,
          salesperson: user.salesperson,
          customeremail: user.customeremail,
          defaultRouteClerk: user.defaultRouteClerk,
          area:user.area,
        }),
      });

      if (response.status === 200) {
        alert("✅ User saved!");
        fetchUsers();
        handleCancelEdit();
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
    finally
    {
      setLoading(false);
    }
  };
  function MultiSelectDropdown({ options, selected, onChange, isOpen, setIsOpen }) {
  
    const toggleOption = (value) => {
      const newSelected = Array.isArray(selected) && selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...(Array.isArray(selected) ? selected : []), value];
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
     
     

      {/* <button className="add-btn" onClick={() => {
        handleCancelEdit();
        setShowModal(true);
      }}>
        ➕ Add New User
      </button> */}

      <div className="user-table-container">
        <h3>User List</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>RouteToClerk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.firstName}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
  <span className={`role-badge role-${u.roles}`}>
    {u.roles}
  </span>
</td>
                <td>{u.defaultRouteClerk || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal slide-in">
            <form className="user-form" onSubmit={handleSubmit}>
              <h3>{editingUserId ? "Edit User" : "Add User"}</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="roles" value={user.roles} onChange={handleChange} required>
                  <option value="">Select Role</option>
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
      isOpen={isAreaOpen}
      setIsOpen={setIsAreaOpen}
      onChange={(selectedValues) =>
        setUser((prev) => ({ ...prev, area: selectedValues }))
      }
    />
                  <div className="form-group">
                    <label>Route to Clerk</label>
                    <select
                      name="defaultRouteClerk"
                      value={user.defaultRouteClerk}
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
                <div className="form-group">
                  <label>Customer Service Email</label>
                  <input
                    type="text"
                    name="customeremail"
                    value={user.customeremail}
                    onChange={handleChange}
                    placeholder="Separate multiple with comma"
                    required
                  />
                </div>
              )}

              <div className="form-buttons">
                <button type="submit">{editingUserId ? "Update" : "Save"}</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
