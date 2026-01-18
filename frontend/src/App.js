// import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
// import './App.css';
// import HomePage from './Pages/HomePage';
// import Operations from './Pages/Operations';
// import RegretPage from './Pages/RegretPage';
// import FavouritePage from './Pages/FavouritePage';
// import SignupPage from './Pages/SignupPage';
// import LoginPage from './Pages/LoginPage';

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path='/' element={<HomePage/>} />
//           <Route path='/operation' element={<Operations/>} />
//           <Route path='/regret' element={<RegretPage/>} />
//           <Route path='/favourite' element={<FavouritePage/>} />
//           <Route path='/signup' element={<SignupPage/>} />
//           <Route path='/login' element={<LoginPage/>} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;




//protected login
//my version

// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import HomePage from './Pages/HomePage';
// import Operations from './Pages/Operations';
// import RegretPage from './Pages/RegretPage';
// import FavouritePage from './Pages/FavouritePage';
// import SignupPage from './Pages/SignupPage';
// import LoginPage from './Pages/LoginPage';
// import { AuthContext } from './Context/AuthContext';

// function App() {
//   const { user, setUser } = useContext(AuthContext);

//   return (
//     <div className="App">
//       <Router>
//         {user ? (
//           <Routes>
//             <Route path="/operation" element={<Operations />} />
//             <Route path="/regret" element={<RegretPage />} />
//             <Route path="/favourite" element={<FavouritePage />} />
//           </Routes>
//         ) : (
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/signup" element={<SignupPage />} />
//             <Route path="/login" element={<LoginPage />} />
//           </Routes>
//         )}
//       </Router>
//     </div>
//   );
// }

// export default App;

//copiolet improved version
// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
// import HomePage from './Pages/HomePage';
// import Operations from './Pages/Operations';
// import RegretPage from './Pages/RegretPage';
// import FavouritePage from './Pages/FavouritePage';
// import SignupPage from './Pages/SignupPage';
// import LoginPage from './Pages/LoginPage';
// import { AuthContext } from '../../Context/AuthContext';

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           {user ? (
//             <>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/operation" element={<Operations />} />
//               <Route path="/regret" element={<RegretPage />} />
//               <Route path="/favourite" element={<FavouritePage />} />
//               {/* Redirect unknown routes */}
//               <Route path="*" element={<Navigate to="/" />} />
//             </>
//           ) : (
//             <>
//               <Route path="/signup" element={<SignupPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               {/* Redirect unknown routes */}
//               <Route path="*" element={<Navigate to="/login" />} />
//             </>
//           )}
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


//chatgpt version

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import HomePage from './Pages/HomePage';
import Operations from './Pages/Operations';
import RegretPage from './Pages/RegretPage';
import FavouritePage from './Pages/FavouritePage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';

import { AuthContext } from './Context/AuthContext';
import { AdminContext } from './Context/AdminContext';
import TherapistsPage from './Pages/TherapistsPage';
import AdminLoginPage from './Pages/AdminLoginPage';
import AdminPage from './Pages/AdminPage';
import ManagePage from './Pages/ManagePage';
import AdminTherapistsPage from './Pages/AdminTherapistsPage';
import AdvancedPage from './Pages/AdvancedPage';

function App() {
  const { user } = useContext(AuthContext);
  const {admin} = useContext(AdminContext)

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/adminlogin" element={!admin ? <AdminLoginPage /> : <Navigate to="/admin" />} />

        {/* PROTECTED ROUTES */}
        <Route path="/operation" element={user ? <Operations /> : <Navigate to="/login" />} />
        <Route path="/regret" element={user ? <RegretPage /> : <Navigate to="/login" />} />
        <Route path="/favourite" element={user ? <FavouritePage /> : <Navigate to="/login" />} />
        <Route path="/therapists" element={user ? <TherapistsPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={admin ? <AdminPage /> : <Navigate to="/adminlogin" />} />
        <Route path="/manage" element={admin ? <ManagePage /> : <Navigate to="/adminlogin" />} />
        <Route path="/add" element={admin ? <AdminTherapistsPage /> : <Navigate to="/adminlogin" />} />
        <Route path="/advanced" element={admin ? <AdvancedPage /> : <Navigate to="/adminlogin" />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
