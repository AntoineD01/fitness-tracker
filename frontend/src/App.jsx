import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MealsPage from './pages/MealsPage';
import WorkoutsPage from './pages/WorkoutsPage';



export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:3003/login/google', {
        credential: credentialResponse.credential,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('jwt', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    navigate('/');
  };

  useEffect(() => {
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('JWT decode error', err);
      }
    }
  }, [token, user]);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = 'bb95eb69bdaabbd671330246aab034b0';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await axios.get(url);
        setWeather({
          city: res.data.name,
          temp: res.data.main.temp,
          icon: res.data.weather[0].icon,
          description: res.data.weather[0].description
        });
      } catch (err) {
        console.error('Erreur météo', err);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error('Erreur géolocalisation', error);
            fetchWeather(48.8566, 2.3522); // fallback Paris
          }
        );
      } else {
        console.error('Géolocalisation non supportée');
        fetchWeather(48.8566, 2.3522);
      }
    };

    getUserLocation();
  }, []);

  return (
    <div className="container" style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <Routes>
        <Route path="/" element={<HomePage token={token} user={user} onLogin={handleLoginSuccess} weather={weather} />} />
        <Route path="/dashboard/*" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<h2>Page not found</h2>} />
      </Routes>
    </div>
  );
}

function HomePage({ token, user, onLogin, weather }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome to Fitness Tracker</h1>
      <p>Manage your meals and workouts effortlessly.</p>

      {weather && (
        <div style={{
          border: '1px solid #ddd',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          background: '#eef',
          display: 'inline-block'
        }}>
          <h3>Weather in {weather.city}</h3>
          <p>{weather.temp}°C — {weather.description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Weather icon" />
        </div>
      )}

      {!token ? (
        <div style={{ marginTop: '2rem' }}>
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => console.log('Google login error')}
          />
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <h3>Hello {user?.name}</h3>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      )}
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      <p>Welcome {user?.name}</p>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="meals">Meals</Link> |{' '}
        <Link to="workouts">Workouts</Link>
      </nav>
      <Routes>
        <Route path="meals" element={<MealsPage enableDelete={true} />} />
        <Route path="workouts" element={<WorkoutsPage enableDelete={true} />} />
        <Route path="*" element={<p>Select a section above.</p>} />
      </Routes>
    </div>
  );
}
