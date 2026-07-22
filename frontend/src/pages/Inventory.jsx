import { useState, useEffect } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const emptyForm = { name: "", sku: "", current_stock: "", reorder_point: "", lead_time_days: "" }

const inputStyle = {
  background: "#0d1117",
  border: "1px solid #1f2937",
  borderRadius: 6,
  color: "#ffffff",
  padding: "8px 10px",
  fontSize: 13,
  width: "100%",
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/inventory`).then(r => setProducts(r.data))
  }, [])

  const statusColor = {
    "Critical": "bg-red-800 text-red-300",
    "Low": "bg-yellow-800 text-yellow-300",
    "In Stock": "bg-green-800 text-green-300"
  }

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const payload = {
      name: form.name,
      sku: form.sku,
      current_stock: Number(form.current_stock),
      reorder_point: Number(form.reorder_point),
      lead_time_days: Number(form.lead_time_days),
    }

    try {
      const r = await axios.post(`${API}/api/inventory`, payload)
      setProducts(p => [...p, r.data])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setSubmitError("Couldn't save the product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="text-2xl font-semibold">Inventory</h1>
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
          {showForm ? "Cancel" : "+ Add Product"}
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
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Name</label>
            <input style={inputStyle} value={form.name} onChange={handleChange("name")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>SKU</label>
            <input style={inputStyle} value={form.sku} onChange={handleChange("sku")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Current Stock</label>
            <input style={inputStyle} type="number" value={form.current_stock} onChange={handleChange("current_stock")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Reorder Point</label>
            <input style={inputStyle} type="number" value={form.reorder_point} onChange={handleChange("reorder_point")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Lead Time (days)</label>
            <input style={inputStyle} type="number" value={form.lead_time_days} onChange={handleChange("lead_time_days")} required />
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
              {submitting ? "Saving..." : "Save Product"}
            </button>
            {submitError && <span style={{ color: "#fca5a5", fontSize: 13 }}>{submitError}</span>}
          </div>
        </form>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-800">
              <th className="text-left pb-3">Product</th>
              <th className="text-left pb-3">SKU</th>
              <th className="text-left pb-3">Stock</th>
              <th className="text-left pb-3">Reorder Point</th>
              <th className="text-left pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-800 last:border-0">
                <td className="py-3 text-white font-medium">{p.name}</td>
                <td className="py-3 text-gray-400">{p.sku}</td>
                <td className="py-3 text-white">{p.current_stock}</td>
                <td className="py-3 text-gray-400">{p.reorder_point}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status]}`}>
                    {p.status}
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
