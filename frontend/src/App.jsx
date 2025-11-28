import { useEffect, useState } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:8080').replace(/\/$/, '')
const EMPTY_EMPLOYEE = { name: '', email: '', departments: '' }

function App() {
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState(EMPTY_EMPLOYEE)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (!message && !error) return
    const timeout = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
    return () => clearTimeout(timeout)
  }, [message, error])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/employees`)
      if (!response.ok) {
        throw new Error('Failed to load employees')
      }
      const data = await response.json()
      setEmployees(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData(EMPTY_EMPLOYEE)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${API_BASE}/employees/${editingId}` : `${API_BASE}/employees`
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update employee' : 'Failed to create employee')
      }

      const saved = await response.json()
      setMessage(editingId ? `Updated ${saved.name}` : `Created ${saved.name}`)
      await fetchEmployees()
      resetForm()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unexpected error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (employee) => {
    setEditingId(employee.id)
    setFormData({
      name: employee.name ?? '',
      email: employee.email ?? '',
      departments: employee.departments ?? '',
    })
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete employee')
      setMessage('Employee deleted')
      if (editingId === id) {
        resetForm()
      }
      await fetchEmployees()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to delete employee')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Employee Dashboard</h1>
          <p className="text-slate-600">
            Manage employees with the Spring Boot API powered by Swagger + MongoDB.
          </p>
        </header>

        {(message || error) && (
          <div
            className={`rounded-md border p-4 text-sm ${
              error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingId ? 'Edit Employee' : 'Add Employee'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Jane Doe"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="jane@company.com"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Departments
              <input
                type="text"
                name="departments"
                value={formData.departments}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="HR, Finance"
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Create Employee'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Employees</h2>
            <button
              type="button"
              onClick={fetchEmployees}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-center text-slate-500">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-slate-500">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Departments</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{employee.name}</td>
                      <td className="px-4 py-3 text-slate-600">{employee.email}</td>
                      <td className="px-4 py-3 text-slate-600">{employee.departments}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(employee)}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(employee.id)}
                            className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
