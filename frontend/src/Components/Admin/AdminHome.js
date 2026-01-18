import React,{useContext,useState,useEffect} from 'react'
import axios from "../axios";
import './AdminHome.css'
import {useNavigate} from 'react-router-dom'
import { AdminContext } from '../../Context/AdminContext';

function AdminHome() {
  const navigate=useNavigate();
  const {admin,setAdmin}=useContext(AdminContext);
  console.log("Admin context in Home:", admin);
  const [stats, setStats] = useState(null);

   useEffect(() => {
    axios.get("/admin-dashboard").then((res) => {
      setStats(res.data.data);
    });
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const handleLogout=(e)=>{
    setAdmin(null);
    navigate('/AdminLogin')

  }

  return (
    <div className='home-Container'>
      <nav className="navbar">
        <div className="navbar-container">
          <a   className="navbar-brand" onClick={()=>{navigate('/admin')}}>Inscrypt</a>
          
               <a className="signup-btn" onClick={handleLogout}>Logout</a>
        </div>
      </nav>



     <div className="admin-dashboard">
      <h2>Admin Analytics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">👥 Users: {stats.totalUsers}</div>
        <div className="stat-card">📝 Regrets: {stats.totalRegrets}</div>
        <div className="stat-card">🚨 High Distress: {stats.highDistressCount}</div>
        <div className="stat-card">⛔ Flagged: {stats.flaggedCount}</div>
      </div>

      <h3>Emotion Distribution</h3>
      <ul>
        {stats.emotionStats.map((e) => (
          <li key={e._id}>{e._id}: {e.count}</li>
        ))}
      </ul>

      <h3>Sentiment Distribution</h3>
      <ul>
        {stats.sentimentStats.map((s) => (
          <li key={s._id}>{s._id}: {s.count}</li>
        ))}
      </ul>
    </div>




      <div className="home-section">
        <div className="home-nav">
          <a  onClick={()=>{navigate('/manage')}}>MANAGE</a>
          <a  onClick={()=>{navigate('/add')}}>Add Thearapists</a>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
