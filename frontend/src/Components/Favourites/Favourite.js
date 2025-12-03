import React,{useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Favourite.css'
import axios from '../axios';
import { AuthContext } from '../../Context/AuthContext'

function Favourite() {
  const {user}=useContext(AuthContext);
   const navigate=useNavigate();
    const {userId}=user
    const [list,setList]=useState([]);
    console.log(userId);
    
   useEffect(() => {
  axios.post('/list', { userId }, { withCredentials: true }).then((response) => {
    console.log("Full response:\n" + JSON.stringify(response.data, null, 2));
    setList(response.data.regrets || []);
  });
}, []);

  const handleDelete = (regretId) => {
  axios.post('/delete', { regretId, userId }, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {
        setList(prevList => prevList.filter(item => item.regretId !== regretId));
      }
    })
    .catch((error) => {
      console.error("Delete failed:", error);
    });
};


   
  return (
    <div>
      {/* Main container for the favorites page */}
<div className="favorites-page-container">
    <div className="navbar">
        <div className="navbar-container">
          <a
            onClick={() => {
              navigate("/");
            }}
            className="navbar-brand"
          >
            Inscrypt
          </a>
        </div>
      </div>
    <div className="favorites-header">
        <h2 className="favorites-title">My Collection</h2>
        <p className="favorites-subtitle">Regrets from the void, collected by you.</p>
    </div>
    <div className="favorites-list-grid">
  {list.length === 0 ? (
    <div className="empty-state">
      <p>You haven't collected any regrets yet.</p>
      <button className="go-to-exchange-btn" onClick={() => navigate("/regret")}>
        Start the Exchange
      </button>
    </div>
  ) : (
    list.map((item, index) => (
  <div key={`${item.regretId}-${index}`}  className="regret-card">
    <p className="regret-text">"{item.regret}"</p>
    <p className="regret-source">— Received from the Void</p>
    <button className="delete-btn" onClick={() => handleDelete(item.regretId)}>Delete</button>
  </div>
))
  )}
</div>
</div>
    </div>
  )
}

export default Favourite
