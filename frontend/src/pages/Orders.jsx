import { useState, useEffect } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const emptyForm = { customer: "", product: "", quantity: "", status: "pending" }
const STATUS_OPTIONS = ["pending", "packing", "shipped", "delivered"]

const inputStyle = {
  background: "#0d1117",
  border: "1px solid #1f2937",
  borderRadius: 6,
  color: "#ffffff",
  padding: "8px 10px",
  fontSize: 13,
  width: "100%",
}

const actionButtonStyle = {
  background: "transparent",
  border: "1px solid #1f2937",
  borderRadius: 6,
  color: "#9ca3af",
  padding: "4px 10px",
  fontSize: 12,
  cursor: "pointer",
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/orders`).then(r => setOrders(r.data))
  }, [])

  const statusColor = {
    delivered: "bg-green-800 text-green-300",
    shipped: "bg-yellow-800 text-yellow-300",
    packing: "bg-blue-800 text-blue-300",
    pending: "bg-gray-700 text-gray-300"
  }

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setSubmitError(null)
  }

  const openAddForm = () => {
    if (showForm && editingId === null) {
      cancelForm()
      return
    }
    setEditingId(null)
    setForm(emptyForm)
    setSubmitError(null)
    setShowForm(true)
  }

  const openEditForm = (order) => {
    setEditingId(order.id)
    setForm({
      customer: order.customer,
      product: order.product,
      quantity: String(order.quantity),
      status: order.status,
    })
    setSubmitError(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      if (editingId !== null) {
        const payload = {
          customer: form.customer,
          product: form.product,
          quantity: Number(form.quantity),
          status: form.status,
        }
        const r = await axios.put(`${API}/api/orders/${editingId}`, payload)
        setOrders(os => os.map(o => (o.id === editingId ? r.data : o)))
      } else {
        const payload = {
          customer: form.customer,
          product: form.product,
          quantity: Number(form.quantity),
        }
        const r = await axios.post(`${API}/api/orders`, payload)
        setOrders(o => [...o, r.data])
      }
      cancelForm()
    } catch {
      setSubmitError(editingId !== null ? "Couldn't update the order. Please try again." : "Couldn't place the order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return
    setDeletingId(id)
    try {
      await axios.delete(`${API}/api/orders/${id}`)
      setOrders(os => os.filter(o => o.id !== id))
      if (editingId === id) cancelForm()
    } catch {
      window.alert("Couldn't delete the order. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <button
          onClick={openAddForm}
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
          {showForm && editingId === null ? "Cancel" : "+ New Order"}
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
            gridTemplateColumns: editingId !== null ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div style={{ gridColumn: "1 / -1", fontSize: 12, color: "#9ca3af" }}>
            {editingId !== null ? `Editing order #${editingId}` : "New order"}
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Customer</label>
            <input style={inputStyle} value={form.customer} onChange={handleChange("customer")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Product</label>
            <input style={inputStyle} value={form.product} onChange={handleChange("product")} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Quantity</label>
            <input style={inputStyle} type="number" value={form.quantity} onChange={handleChange("quantity")} required />
          </div>
          {editingId !== null && (
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Status</label>
              <select style={inputStyle} value={form.status} onChange={handleChange("status")}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
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
              {submitting ? "Saving..." : editingId !== null ? "Update Order" : "Place Order"}
            </button>
            {editingId !== null && (
              <button type="button" onClick={cancelForm} style={{ ...actionButtonStyle, padding: "8px 16px" }}>
                Cancel
              </button>
            )}
            {submitError && <span style={{ color: "#fca5a5", fontSize: 13 }}>{submitError}</span>}
          </div>
        </form>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-800">
              <th className="text-left pb-3">Order ID</th>
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Product</th>
              <th className="text-left pb-3">Qty</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-gray-800 last:border-0">
                <td className="py-3 text-white font-medium">#{o.id}</td>
                <td className="py-3 text-gray-400">{o.customer}</td>
                <td className="py-3 text-gray-400">{o.product}</td>
                <td className="py-3 text-white">{o.quantity}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3">
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={actionButtonStyle} onClick={() => openEditForm(o)}>Edit</button>
                    <button
                      style={{ ...actionButtonStyle, color: "#fca5a5", opacity: deletingId === o.id ? 0.6 : 1 }}
                      onClick={() => handleDelete(o.id)}
                      disabled={deletingId === o.id}
                    >
                      {deletingId === o.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
