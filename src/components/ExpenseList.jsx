import { useState, useEffect } from 'react'
import { getExpenses } from '../api'

function ExpenseList({ groupId, refreshKey }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  // Re-fetch expenses whenever groupId or refreshKey changes
  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true)
      try {
        const data = await getExpenses(groupId)
        setExpenses(Array.isArray(data) ? data : data.expenses || [])
      } catch (err) {
        console.error('Failed to fetch expenses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExpenses()
  }, [groupId, refreshKey])

  if (loading) return <p className="text-gray-500 text-center">Loading expenses...</p>
  if (expenses.length === 0) return <p className="text-gray-400 text-center text-sm">No expenses yet. Add one above.</p>
    // Render expense cards
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Expenses ({expenses.length})</h3>
      <div className="space-y-2">
        {expenses.map((expense, i) => (
          <div key={expense.expenseId || i} className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div>
              <p className="font-medium text-gray-700">{expense.description}</p>
              <p className="text-sm text-gray-500">Paid by {expense.paidBy}</p>
            </div>
            <span className="font-semibold text-gray-800">₹{expense.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseList