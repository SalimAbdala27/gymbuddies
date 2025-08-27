// src/App.jsx
import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Login from './pages/Login/Login';
import Friends from './pages/Friends/Friends';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function AppWrapper() {
  const { user } = useAuth();

  return (
    <div className="app-wrapper">
      <Header />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={ <h2>Welcome to Gym Buddies 2.0</h2>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/friends" element={<Friends/>} />
          {/* Add more routes here later */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
