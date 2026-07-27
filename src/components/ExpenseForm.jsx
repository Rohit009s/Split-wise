import { useState } from 'react'
import { addExpense } from '../api'

function ExpenseForm({ groupId, members, onExpenseAdded }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(members[0] || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Calculate equal split amount for each member
    const numAmount = parseFloat(amount)
    const splitAmount = numAmount / members.length
    const splits = members.map(member => ({
      memberId: member,
      amount: Math.round(splitAmount * 100) / 100,
    }))
    try {
      await addExpense(groupId, { description, amount: numAmount, paidBy, splits })
      setDescription('')
      setAmount('')
      onExpenseAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
    // Form UI with description, amount, and paidBy fields
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Add Expense</h3>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="0.01"
          step="0.01"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
                <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {members.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500">Split equally among all {members.length} members</p>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  )
}

export default ExpenseForm