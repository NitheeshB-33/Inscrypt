import React from "react";
import { useNavigate } from "react-router-dom";
import "./Operation.css";
function Operation() {
  const navigate = useNavigate();
  return (
    <div className="operation">
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
      <div className="home-operation">
        <div className="card" onClick={() => navigate("/regret")}>
          <h2>Send & Receive Regrets</h2>
          <p>Share your thoughts anonymously</p>
        </div>
        <div className="card" onClick={() => navigate("/favourite")}>
          <h2>Favourites</h2>
          <p>View your saved regrets</p>
        </div>
      </div>
    </div>
  );
}

export default Operation;
