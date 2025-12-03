import React, { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import './About.css'
import { AuthContext } from '../../Context/AuthContext';

function About() {
    const {user}=useContext(AuthContext);
    const navigate=useNavigate();
  return (
    <div>
      <div className="about-section"  id="about-section">
      <div className="container">
        <h2 className="section-title">Inscrypt</h2>
        <p className="section-subtitle">A digital regret exchange</p>

        <div className="content-grid">
          <div className="content-card">
            <h3 className="card-title">Working</h3>
            <p className="card-text">
              Users anonymously write short regrets and send them into the void. This fosters vulnerability without judgment.
            </p>
          </div>

          <div className="content-card">
            <h3 className="card-title">Aim</h3>
            <p className="card-text">
              The goal is to foster empathy and connection by showing that you are not alone in your experiences, big or small.
            </p>
          </div>

          <div className="content-card">
            <h3 className="card-title">Principle</h3>
            <p className="card-text">
              In exchange for a regret, a user receives a random, anonymous regret from another person, building a unique collection.
            </p>
          </div>
        </div>

       { user ? <button onClick={()=>{navigate('/operation')}} className="enter-loop-btn">Enter The Loop</button> :'Login For Unlock Inscrypt!' }
      
      </div>
      
    </div>
    <p style={{color:'#dddddd32',background:'#0d0d0d'}}>Inscrypt, a subsidiary of SportsRoundups Under the aegis of NBTEQ | © 2025 Inscrypt, SportsRoundups Platforms Limited. All rights reserved | Use implies agreement to terms and privacy | contact us@:sportsroundups1@gmail.com</p>
    </div>
  )
}

export default About
