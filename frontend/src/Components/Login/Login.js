import React,{useState,useContext} from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'
import axios from '../axios';
import { AuthContext } from '../../Context/AuthContext';

function Login() {
  const {setUser}=useContext(AuthContext)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate=useNavigate()
  const handleSubmit =(e)=>{
    e.preventDefault()
    axios.post('/login',{email,password},{withCredentials:true}).then((response)=>{
      console.log("succesfully loged" +response.data.username);
      setUser({username:response.data.username,userId:response.data._id})
       console.log(response);
       
      navigate('/')
    })
    .catch(err => {
    if(err.response && err.response.status === 400){
      alert(err.response.data.error); 
    } else {
      console.log(err);
    }
  });
  }

  return (
    <div>
      <div className="loginParentDiv">
        {/* <img width="200px" height="200px" src={Logo}></img> */}
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
        <a onClick={()=>navigate("/signup")}>Signup</a>
      </div>
    </div>
  );
}

export default Login;
