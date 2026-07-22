import { useState, useEffect } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const emptyForm = { name: "", email: "", lead_time_days: "", reliability_score: "" }

const inputStyle = {
  background: "#0d1117",
  border: "1px solid #1f2937",
  borderRadius: 6,
  color: "#ffffff",
  padding: "8px 10px",
  fontSize: 13,
  width: "100%",
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/suppliers`).then(r => setSuppliers(r.data))
  }, [])

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const payload = {
      name: form.name,
      email: form.email,
      lead_time_days: Number(form.lead_time_days),
      reliability_score: Number(form.reliability_score),
    }

    try {
      const r = await axios.post(`${API}/api/suppliers`, payload)
      setSuppliers(s => [...s, r.data])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setSubmitError("Couldn't save the supplier. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            background: "#1d4ed8",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Add Supplier"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 12,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Name</label>
            <input style={inputStyle} value={form.name} onChange={handleChange("name")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Email</label>
            <input style={inputStyle} type="email" value={form.email} onChange={handleChange("email")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Lead Time (days)</label>
            <input style={inputStyle} type="number" value={form.lead_time_days} onChange={handleChange("lead_time_days")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Reliability Score</label>
            <input style={inputStyle} type="number" min="0" max="100" value={form.reliability_score} onChange={handleChange("reliability_score")} required />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "#1d4ed8",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Saving..." : "Save Supplier"}
            </button>
            {submitError && <span style={{ color: "#fca5a5", fontSize: 13 }}>{submitError}</span>}
          </div>
        </form>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-800">
              <th className="text-left pb-3">Name</th>
              <th className="text-left pb-3">Email</th>
              <th className="text-left pb-3">Lead Time (days)</th>
              <th className="text-left pb-3">Reliability Score</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-b border-gray-800 last:border-0">
                <td className="py-3 text-white font-medium">{s.name}</td>
                <td className="py-3 text-gray-400">{s.email}</td>
                <td className="py-3 text-white">{s.lead_time_days}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    s.reliability_score >= 90 ? "bg-green-800 text-green-300" : "bg-yellow-800 text-yellow-300"
                  }`}>
                    {s.reliability_score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
