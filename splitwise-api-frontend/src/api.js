const API_URL = import.meta.env.VITE_API_URL;

// Creates a new expense group with named members
export async function createGroup(name, members) {
  const response = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, members }),
  });
  if (!response.ok) throw new Error('Failed to create group');
  return response.json();
}

// Fetches details for an existing group
export async function getGroup(groupId) {
  const response = await fetch(`${API_URL}/groups/${groupId}`);
  if (!response.ok) throw new Error('Failed to fetch group');
  return response.json();
}

// Logs a new expense to a group
export async function addExpense(groupId, expense) {
  const response = await fetch(`${API_URL}/groups/${groupId}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Failed to add expense');
  return response.json();
}
// Fetches all expenses for a group
export async function getExpenses(groupId) {
  const response = await fetch(`${API_URL}/groups/${groupId}/expenses`);
  if (!response.ok) throw new Error('Failed to fetch expenses');
  return response.json();
}

// Calculates simplified settlements for a group
export async function getSettlements(groupId) {
  const response = await fetch(`${API_URL}/groups/${groupId}/settle`);
  if (!response.ok) throw new Error('Failed to calculate settlements');
  return response.json();
}

// Fetches step-by-step settlement algorithm breakdown
export async function getSettlementSteps(groupId) {
  const response = await fetch(`${API_URL}/groups/${groupId}/settle/steps`);
  if (!response.ok) throw new Error('Failed to fetch settlement steps');
  return response.json();
}