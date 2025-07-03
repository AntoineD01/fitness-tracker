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
    <div>
      <h2>Meals</h2>
      <ul>
        {meals.map(meal => (
          <li key={meal._id || meal.id}>
            {meal.name} - {meal.calories} cal
          </li>
        ))}
      </ul>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Calories" type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} />
      <button onClick={addMeal}>Add Meal</button>
    </div>
  )
}