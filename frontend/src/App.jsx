import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MealsPage from './pages/MealsPage';
import WorkoutsPage from './pages/WorkoutsPage';
import { jwtDecode } from 'jwt-decode';


export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:3003/login/google', {
        credential: credentialResponse.credential,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('jwt', res.data.token);
    } catch (err) {
      console.error('Erreur login', err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  useEffect(() => {
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Erreur de décodage du JWT', err);
      }
    }
  }, [token, user]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Fitness Tracker</h1>

      {!token && (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('❌ Échec du login Google')}
        />
      )}

      {token && (
        <div>
          <h3>Welcome {user?.name}</h3>
          <p>Email: {user?.email}</p>
          <p>JWT enregistré localStorage ✅</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <nav style={{ marginTop: '1rem' }}>
        <Link to="/">Accueil</Link> | <Link to="/meals">Meals</Link> | <Link to="/workouts">Workouts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Bienvenue sur Fitness Tracker</h2>} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="*" element={<h2>Page not found</h2>} />
      </Routes>
    </div>
  );
}
