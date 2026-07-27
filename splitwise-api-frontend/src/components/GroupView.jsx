import { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import Settlements from './Settlements'

function GroupView({ group, onReset }) {
  // Track expenses and a refresh key to trigger re-fetches
  const [expenses, setExpenses] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  function handleExpenseAdded() {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
            <p className="text-gray-500 text-sm">ID: {group.groupId}</p>
          </div>
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Start New Group
          </button>
        </div>
                <div className="mt-3 flex flex-wrap gap-2">
          {group.members.map(member => (
            <span key={member} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
              {member}
            </span>
          ))}
        </div>
      </div>

      {/* Child components for expenses and settlements */}
      <ExpenseForm
        groupId={group.groupId}
        members={group.members}
        onExpenseAdded={handleExpenseAdded}
      />

      <ExpenseList groupId={group.groupId} refreshKey={refreshKey} />

      <Settlements groupId={group.groupId} expenseCount={refreshKey} />
    </div>
  )
}

export default GroupView