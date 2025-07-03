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
    <div>
      <h2>Workouts</h2>
      <ul>
        {workouts.map(w => (
          <li key={w.id}>{w.name} - {w.duration} min</li>
        ))}
      </ul>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Duration" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
      <button onClick={addWorkout}>Add Workout</button>
    </div>
  )
}