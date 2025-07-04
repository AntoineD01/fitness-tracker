import { useEffect, useState } from 'react'
import api from '../api'

export default function MealsPage() {
  const [meals, setMeals] = useState([])
  const [form, setForm] = useState({ name: '', calories: '', user_id: 1 })

  useEffect(() => {
    api.get('/meals/').then(res => setMeals(res.data))
  }, [])

  const addMeal = () => {
    api.post('/meals/', form).then(res => {
      setMeals(prev => [...prev, res.data])
      setForm({ ...form, name: '', calories: '' })
    })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
      <h2>Meals</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {meals.map(meal => (
          <li key={meal._id || meal.id} style={{ margin: '0.5rem 0', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
            <strong>{meal.name}</strong> — {meal.calories} cal
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
          placeholder="Calories"
          type="number"
          value={form.calories}
          onChange={e => setForm({ ...form, calories: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={addMeal}>Add Meal</button>
      </div>
    </div>
  );
}