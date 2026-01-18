import React,{useState,useContext} from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom'
import axios from '../axios';
import {AdminContext} from '../../Context/AdminContext';

function AdminLogin() {
  const {admin,setAdmin}=useContext(AdminContext)  
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate=useNavigate();
  const handleSubmit =(e)=>{
    e.preventDefault()
    axios.post('/adminLogin',{email,password},{withCredentials:true}).then((response)=>{
      console.log("succesfully loged");
      setAdmin(response.data)
      navigate('/admin')
    })
    .catch(err => {
    if(err.response && err.response.status === 400){
      alert(err.response.data.error); 
    } else {
      console.log(err);
    }
  });
  }


  const style = {
  backgroundImage: "url('/assets/kkrbackground1.png')",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};



  return (
    <div style={style}>
      <div className="loginParentDiv" >
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            id="fname"
            name="email"
           
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            id="lname"
            name="password"
            
          />
          <br />
          <br />
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
