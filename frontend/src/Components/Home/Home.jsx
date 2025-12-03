
import React, { useState, useEffect,useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import './Home.css';
import About from '../About/About';
import { AuthContext } from '../../Context/AuthContext';

const images = [
  {
    src: '/Images/homepage.png',
    alt: 'Abstract geometric graphic',
  },
  {
    src: '/Images/homepage2.png',
    alt: 'Futuristic chest graphic with dots',
  },
];

function Home() {
  const {user,setUser}=useContext(AuthContext);
  const navigate=useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // This useEffect hook handles the automatic slideshow
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5000ms = 5 seconds

        // The cleanup function
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array ensures this runs once


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.navbar-links');
    const signupBtn = document.querySelector('.signup-btn');

    const toggleMenu = () => {
      setIsMenuOpen(prevState => !prevState);
      navLinks.classList.toggle('active');
      signupBtn.classList.toggle('active');
    };

    if (hamburger) {
      hamburger.addEventListener('click', toggleMenu);
    }

    return () => {
      if (hamburger) {
        hamburger.removeEventListener('click', toggleMenu);
      }
    };
  }, []);

  return (
    <div className="home-container">
    
      <nav className="navbar">
        <div className="navbar-container">
          <a onClick={()=>{navigate('/')}}  className="navbar-brand">Inscrypt</a>
          <div className="hamburger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <ul className="navbar-links">
            <li><a href="#about-section" >About</a></li>
            <li><a href="#about-section">Services</a></li>
            <li><a href="#about-section">Contact</a></li>
          </ul>
        
          {user ? (
            <>
               <a className="welcome-message" >Welcome {user.username}! </a>
               <a className="signup-btn" onClick={()=>{ setUser(null);navigate('/login')}}>Logout</a>
            </>
          ):(
            <>
             <a className="signup-btn" onClick={()=>{navigate('/login')}}>Signup</a>
            </>
          )}
         
        </div>
      </nav>

      {/* Carousel container as the background */}
      <div className="carousel-container">
        <img
          src={images[currentImageIndex].src}
          alt={images[currentImageIndex].alt}
          className="carousel-image"
        />
       

    

        {/* Navigation Dots */}
        <div className="dots-container">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
            ></span>
          ))}
        </div>
      </div>

    <About/>
  
   </div>
  );
}

export default Home;
