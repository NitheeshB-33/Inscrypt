import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';
import HomePage from './Pages/HomePage';
import Operations from './Pages/Operations';
import RegretPage from './Pages/RegretPage';
import FavouritePage from './Pages/FavouritePage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/operation' element={<Operations/>} />
          <Route path='/regret' element={<RegretPage/>} />
          <Route path='/favourite' element={<FavouritePage/>} />
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/login' element={<LoginPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
