import { useState } from 'react'
import GroupForm from './components/GroupForm'
import GroupView from './components/GroupView'

function App() {
  const [group, setGroup] = useState(null)

  function handleGroupCreated(groupData) {
    setGroup(groupData)
  }

  function handleReset() {
    setGroup(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Splitwise Debt Simplifier</h1>
        <p className="text-indigo-200 text-sm">Split expenses with friends</p>
      </header>
      <main className="max-w-2xl mx-auto py-8 px-4">
        {group ? (
          <GroupView group={group} onReset={handleReset} />
        ) : (
          <GroupForm onGroupCreated={handleGroupCreated} />
        )}
      </main>
    </div>
  )
}

export default App
