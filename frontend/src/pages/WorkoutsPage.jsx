import { useEffect, useState } from 'react'
import api from '../api'

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([])
  const [form, setForm] = useState({ name: '', duration: '', user_id: 1 })

  useEffect(() => {
    api.get('/workouts/').then(res => setWorkouts(res.data))
  }, [])

  const addWorkout = () => {
    api.post('/workouts/', form).then(res => {
      setWorkouts(prev => [...prev, res.data])
      setForm({ ...form, name: '', duration: '' })
    })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
      <h2>Workouts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {workouts.map(w => (
          <li key={w.id} style={{ margin: '0.5rem 0', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
            <strong>{w.name}</strong> — {w.duration} min
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          placeholder="Duration"
          type="number"
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={addWorkout}>Add Workout</button>
      </div>
    </div>
  );

}