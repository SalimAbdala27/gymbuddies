// src/App.jsx
import logo from './logo.svg';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login/Login';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      {/* Wrap Header, App, and Footer in a flex container */}
      <div className="app-wrapper">
        <Header />
        <div className="App">
          {/* Main content area */}
          <Routes>
            <Route path="/" element={<h2>Welcome to Gym Buddies 2.0</h2>} />
            <Route path="/login" element={<Login />} />
            {/* Add more routes here */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;