import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./AdminTherapists.css";

function AdminTherapists() {
   const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    experience: "",
    mode: "",
    contact: "",
    specialization: ""
  });

  const loadTherapists = () => {
    axios.get("/admin/therapists").then(res => setTherapists(res.data));
  };

  useEffect(loadTherapists, []);

  const toggleStatus = (id, current) => {
    axios.post("/admin/therapist-status", {
      therapistId: id,
      isActive: !current
    }).then(loadTherapists);
  };

  const addTherapist = () => {
    axios.post("/admin/add-therapist", {
      ...form,
      specialization: form.specialization.split(",")
    }).then(() => {
      setForm({
        name: "",
        qualification: "",
        experience: "",
        mode: "",
        contact: "",
        specialization: ""
      });
      loadTherapists();
    });
  };

  return (
    
    <div className="admin-therapists">
         <nav className="navbar">
        <div className="navbar-container">
          <a className="navbar-brand" onClick={() => navigate("/admin")}>
            Inscrypt
          </a>
          <a className="signup-btn" onClick={() => navigate("/AdminLogin")}>
            Logout
          </a>
        </div>
      </nav>
      <h2>Therapist Management</h2>

      {/* Add Therapist */}
      <div className="add-box">
        <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Qualification" onChange={e=>setForm({...form,qualification:e.target.value})}/>
        <input placeholder="Experience" onChange={e=>setForm({...form,experience:e.target.value})}/>
        <input placeholder="Mode" onChange={e=>setForm({...form,mode:e.target.value})}/>
        <input placeholder="Contact" onChange={e=>setForm({...form,contact:e.target.value})}/>
        <input placeholder="Specializations (comma separated)" onChange={e=>setForm({...form,specialization:e.target.value})}/>
        <button onClick={addTherapist}>Add Therapist</button>
      </div>

      {/* Therapist List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.qualification}</td>
              <td>{t.experience}</td>
              <td>{t.isActive ? "Active" : "Disabled"}</td>
              <td>
                <button onClick={()=>toggleStatus(t._id, t.isActive)}>
                  {t.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTherapists;
