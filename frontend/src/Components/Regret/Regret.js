import React,{useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Regret.css'
import axios from '../axios'
import { AuthContext } from '../../Context/AuthContext'

function Regret() {
    const {user}=useContext(AuthContext);
    const navigate=useNavigate()
    const [isSent,setIsSent]=useState(false);
    const [regret,setRegret]=useState();
    const [returnregret,setReturnregret]=useState();
    const [blockedMessage, setBlockedMessage] = useState(null);
    const [supportiveTip, setSupportiveTip] = useState(null);
    const [therapySuggestion, setTherapySuggestion] = useState(null);
    // const [therapists, setTherapists] = useState([]);
    // const [showTherapists, setShowTherapists] = useState(false);



    //ml
    //const [analysis, setAnalysis] = useState(null); //for advanced analyzis -helpfull in futer features implementation
    //contains metadata in this format
//     analysis: {
//   emotionLabel: "Sadness",
//   sentimentLabel: "Negative",
//   sentimentScore: -0.98,
//   category: "Personal choices",
//   analyzedAt: "...",
// }

    // eg:create a section(below the receiving regret section,pro subscription needed) "unlock your regret mentality & score"
    // then show like "Emotion: Sadness  
    //                 Sentiment: Negative  
    //                 Category: Family "
    //ml


    const handleSubmit = (e)=>{
      e.preventDefault();
      console.log(regret);
      
      axios.post('/regret',{regret,user},{ withCredentials: true }).then((response)=>{
        console.log(response.data);


      if (response.data.blocked) {
  setBlockedMessage(response.data.message); // store reason
  setReturnregret(null);                    // no regret to show
  setIsSent(true);                          // switch to receive-view
  setSupportiveTip(response.data.supportiveTip);
  return;
}






        //else case
        setIsSent(true)
        // setReturnregret(response.data)


        //ml
        setReturnregret(response.data.recommendedRegret)
        setSupportiveTip(response.data.supportiveTip); // ✅ ADD THIS
        setTherapySuggestion(response.data.therapySuggestion);
        setBlockedMessage(null);  

//         if (response.data.highDistress) {
//   axios.get('/therapists').then((res) => {
//     setTherapists(res.data.therapists);
//     setShowTherapists(true);
//   });
// }


        //ml

      })
    }

    const handleFavourSubmit = (e)=>{
      axios.post('/favourite',{returnregret,user},{withCredentials:true}).then((response)=>{
        console.log(response);
        navigate('/favourite');
      })
    }

  return (
    <div>
      {/* Main container for the regret exchange page */}
<div className="regret-page-container">
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
    <div className="regret-card-wrapper">
        {/*
          This is a placeholder for your conditional rendering.
          Use a ternary operator here based on your state variable.
          Example: {isRegretSent ? (JSX for the receive view) : (JSX for the send view)}
        */}

        {/* --- Send Regret View --- */}
        {isSent ? (
        <div className="regret-card receive-view">
            <h2 className="card-heading">You Have Received a Regret</h2>
            <div className="received-regret">
              {supportiveTip && (
  <div className="supportive-tip">
    💡 {supportiveTip}
  </div>
)}

  {therapySuggestion?.show && (
  <div className="therapy-suggestion">
    <h4>💙 Support Option</h4>
    <p>{therapySuggestion.message}</p>

    <button
      className="regret-action-btn"
      onClick={() => navigate("/therapists")}
    >
      View Professionals
    </button>
  </div>
)}


{/* {showTherapists && therapists.length > 0 && (
  <div className="therapist-directory">
    <h4>👩‍⚕️ Available Professionals</h4>

    {therapists.map((t) => (
      <div key={t._id} className="therapist-card">
        <strong>{t.name}</strong>
        <p>{t.qualification}</p>
        <p>Specialization: {t.specialization.join(", ")}</p>
        <p>Mode: {t.mode}</p>
      </div>
    ))}
  </div>
)} */}




  {blockedMessage ? (
    <p className="blocked-message">
      {blockedMessage}
    </p>
  ) : (
    returnregret?.regret
  )}
</div>

            {!blockedMessage && (
  <button className="regret-action-btn" onClick={handleFavourSubmit}>
    Add to My Collection
  </button>
)}
    

        </div>
        ):( <div className="regret-card send-view">
            <h2 className="card-heading">Send Your Regret into the Void</h2>
            <textarea
                className="regret-input"
                placeholder="e.g., I regret not saying 'hello' to that person."
                maxLength="250"
                value={regret}
                onChange={(e)=>{setRegret(e.target.value)}}
            ></textarea>
            <button onClick={handleSubmit} className="regret-action-btn">
                Send Regret
            </button>
        </div>)}
       

       
    </div>
</div>
    </div>
  )
}

export default Regret
