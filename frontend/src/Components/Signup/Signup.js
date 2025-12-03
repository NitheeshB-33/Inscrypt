import React, { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from '../axios';
import { AuthContext } from '../../Context/AuthContext';

export default function Signup() {
  const {setUser}=useContext(AuthContext)
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/signup', { username, email, phone, password }, { withCredentials: true })
      .then((response) => {
        console.log('User registered:', username);
        setUser({username:response.data.username,userId:response.data._id})
        console.log(response);
        
        navigate('/');
      })
      .catch(err => {
    if(err.response && err.response.status === 400){
      alert(err.response.data.error); // Show "Email already exists"
    } else {
      console.log(err);
    }
  });
  };

  return (
    <div className="signupParentDiv">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          className="input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          name="username"
        />
        <br />

        <label htmlFor="email">Email</label>
        <br />
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
        />
        <br />

        <label htmlFor="phone">Phone</label>
        <br />
        <input
          className="input"
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          id="phone"
          name="phone"
        />
        <br />

        <label htmlFor="password">Password</label>
        <br />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          name="password"
        />
        <br /><br />

        <button type="submit">Signup</button>
      </form>

      <button type="button" onClick={() => navigate('/login')}>Login</button>
    </div>
  );
}

