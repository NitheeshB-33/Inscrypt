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
        setIsSent(true)
        // setReturnregret(response.data)


        //ml
        setReturnregret(response.data.recommendedRegret)
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
                {returnregret?.regret}
            </div>
            <button className="regret-action-btn" onClick={handleFavourSubmit}>
                Add to My Collection
            </button>
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
