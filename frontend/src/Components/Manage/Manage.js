import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Manage.css"; 
import axios from "../axios";

function Manage() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    axios.get('/all-users', { withCredentials: true }).then((response) => {
      setUsersList(response.data);
    });
  }, []);

  const handleDelete = (id) => {
    axios.post('/deleteUser', { userId: id }, { withCredentials: true }).then(() => {
      // refresh list instead of redirecting always
      setUsersList(prev => prev.filter(user => user._id !== id));
    });
  };

  return (
    <>
    <nav className="navbar">
        <div className="navbar-container">
          <a   className="navbar-brand" onClick={()=>{navigate('/admin')}}>Inscrypt</a>
          
               <a className="signup-btn" onClick={()=>{navigate('/AdminLogin')}}>Logout</a>
        </div>
      </nav>
    <section className="admin-section">
      <div className="admin-container">
        <table className="admin-table" id="productsTable">
          <thead>
            <tr>
              <th>USER ID</th>
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>PASSWORD</th>
              <th>OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className="ban-button"
                    onClick={() => handleDelete(user._id)}
                  >
                    BAN
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </>
  );
}

export default Manage;
