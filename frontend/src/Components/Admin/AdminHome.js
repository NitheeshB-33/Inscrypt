import React,{useContext} from 'react'
import './AdminHome.css'
import {useNavigate} from 'react-router-dom'
import { AdminContext } from '../../Context/AdminContext';

function AdminHome() {
  const navigate=useNavigate();
  const {admin,setAdmin}=useContext(AdminContext);
  console.log("Admin context in Home:", admin);

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
      <div className="home-section">
        <div className="home-nav">
          <a  onClick={()=>{navigate('/manage')}}>MANAGE</a>
         
        </div>
      </div>
    </div>
  )
}

export default AdminHome
