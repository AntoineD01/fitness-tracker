import { Routes, Route, Link } from 'react-router-dom'
import MealsPage from './pages/MealsPage'
import WorkoutsPage from './pages/WorkoutsPage'

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <nav>
        <Link to="/meals">Meals</Link> | <Link to="/workouts">Workouts</Link>
      </nav>
      <Routes>
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="*" element={<h1>Welcome to Fitness Tracker</h1>} />
      </Routes>
    </div>
  )
}

export default App