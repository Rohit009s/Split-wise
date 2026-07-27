import { useState } from 'react'
import { getSettlements } from '../api'

function Settlements({ groupId, expenseCount }) {
  const [settlements, setSettlements] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSettle() {
    setError(null)
    setLoading(true)

    try {
      const data = await getSettlements(groupId)
      setSettlements(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Settlements
        </h3>

        <button
          onClick={handleSettle}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Settle Up'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {settlements && (
        <div className="space-y-3">
          {settlements.settlements &&
          settlements.settlements.length > 0 ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded px-4 py-2 text-sm text-green-800">
                Simplified to{' '}
                {settlements.settlements.length} transaction
                {settlements.settlements.length !== 1 ? 's' : ''}
              </div>

              {settlements.settlements.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 rounded px-4 py-3"
                >
                  <span className="text-gray-700">
                    <span className="font-semibold">{t.from}</span>
                    {' '}pays{' '}
                    <span className="font-semibold">{t.to}</span>
                  </span>

                  <span className="font-bold text-indigo-600">
                    ₹{t.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              All settled! No transactions needed.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Settlements