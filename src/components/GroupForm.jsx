import { useState } from 'react'
import { createGroup } from '../api'

function GroupForm({ onGroupCreated }) {
  const [name, setName] = useState('')
  const [membersInput, setMembersInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Parse comma-separated input into array of names
    const members = membersInput.split(',').map(m => m.trim()).filter(Boolean)

    if (members.length < 2) {
      setError('Please enter at least 2 members')
      setLoading(false)
      return
    }

    try {
      const data = await createGroup(name, members)
      onGroupCreated({ ...data, name, members })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
    // Form UI with error alert, name input, members input, and submit button
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create a New Group</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Trip Friends"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
            <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Members (comma-separated)</label>
        <input
          type="text"
          value={membersInput}
          onChange={(e) => setMembersInput(e.target.value)}
          placeholder="e.g., Alice, Bob, Charlie"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  )
}

export default GroupForm