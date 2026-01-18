import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../axios'
import './Therapists.css'
function Therapists() {
  const navigate=useNavigate()
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    axios.get("/therapists").then((res) => {
      setTherapists(res.data.therapists);
    });
  }, []);

  return (
    <div className="therapists-page">
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
      <h2>Available Mental Health Professionals</h2>

      {therapists.map((t) => (
        <div key={t._id} className="therapist-card">
          <h4>{t.name}</h4>
          <p>{t.qualification}</p>
          <p>Specialization: {t.specialization.join(", ")}</p>
          <p>Mode: {t.mode}</p>
        </div>
      ))}
      <p className="disclaimer">
  ⚠️ This platform does not provide medical diagnosis or treatment.
  Professional support is optional and user-initiated.
</p>

    </div>
  );
}

export default Therapists
