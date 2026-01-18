import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./Advanced.css";

function Advanced() {
  const navigate = useNavigate();
  const [flaggedList, setFlaggedList] = useState([]);

  useEffect(() => {
    axios.get("/all-flagged", { withCredentials: true }).then((response) => {
      setFlaggedList(response.data);
    });
  }, []);

  return (
    <>
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

      <section className="admin-section">
        <div className="admin-container">
          <h2>Flagged Regrets (Moderation)</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>REGRET</th>
                <th>TOXICITY TYPE</th>
                <th>SCORE</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>

            <tbody>
              {flaggedList.map((item) => (
                <tr key={item._id}>
                  <td>{item.userId}</td>

                  <td className="regret-text">
                    {item.regretText}
                  </td>

                  <td>{item.toxicityType}</td>

                  <td style={{ fontWeight: "bold" }}>
                    {item.toxicityScore}
                  </td>

                  <td>{item.status}</td>

                  <td>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         <button
                    className="ban-button" 
                     style={{ display: 'block', margin: '0 auto', textAlign: 'center' }}
                  onClick={()=>{navigate('/notice')}}>
                    Sent Notice
                  </button>
      </section>
    </>
  );
}

export default Advanced;
