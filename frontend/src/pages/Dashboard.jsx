import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://chainiq-yid1.onrender.com"

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [summary, setSummary] = useState("")
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/dashboard/metrics`).then(r => setMetrics(r.data))
    axios.get(`${API}/api/alerts`).then(r => setAlerts(r.data))
    axios.get(`${API}/api/alerts/summary`).then(r => setSummary(r.data.summary))
    axios.get(`${API}/api/orders`).then(r => setOrders(r.data))
  }, [])

  const badgeClass = { delivered:"badge badge-green", shipped:"badge badge-yellow", packing:"badge badge-blue", pending:"badge badge-gray" }
  const alertClass = { critical:"alert-item alert-critical", warning:"alert-item alert-warning", info:"alert-item alert-info" }

  return (
    <div>
      <div className="page-title">Dashboard</div>
      {summary && <div className="alert-banner">🤖 <b>AI Alert:</b> {summary}</div>}
      <div className="metrics-grid">
        {metrics && [
          {label:"Orders Today", value: metrics.total_orders_today},
          {label:"Inventory Health", value: `${metrics.inventory_health_pct}%`},
          {label:"Supplier OTIF", value: `${metrics.supplier_otif_pct}%`},
          {label:"Return Rate", value: `${metrics.return_rate_pct}%`}
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">Recent Orders</div>
          <table>
            <thead><tr><th>ID</th><th>Customer</th><th>Status</th></tr></thead>
            <tbody>{orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer}</td>
                <td><span className={badgeClass[o.status]}>{o.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-title">AI Alerts</div>
          {alerts.map(a => (
            <div key={a.id} className={alertClass[a.severity]}>{a.message}</div>
          ))}
        </div>
      </div>
    </div>
  )
}