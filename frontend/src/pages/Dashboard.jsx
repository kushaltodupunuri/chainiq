import { useState, useEffect } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const API = import.meta.env.VITE_API_URL

const badgeClass = { delivered:"badge badge-green", shipped:"badge badge-yellow", packing:"badge badge-blue", pending:"badge badge-gray" }
const alertClass = { critical:"alert-item alert-critical", warning:"alert-item alert-warning", info:"alert-item alert-info" }

const DEMAND_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const DEMAND_SERIES = {
  "Organic Oats": [12,15,11,18,14,9,5],
  "Whole Milk": [30,28,25,22,20,18,12],
  "Sourdough Bread": [20,18,22,19,16,14,8],
}
const DEMAND_COLORS = { "Organic Oats": "#3987e5", "Whole Milk": "#d95926", "Sourdough Bread": "#199e70" }
const demandData = DEMAND_DAYS.map((day, i) => {
  const row = { day }
  Object.keys(DEMAND_SERIES).forEach(product => { row[product] = DEMAND_SERIES[product][i] })
  return row
})

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [summary, setSummary] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.allSettled([
      axios.get(`${API}/api/dashboard/metrics`, { signal: controller.signal }),
      axios.get(`${API}/api/alerts`, { signal: controller.signal }),
      axios.get(`${API}/api/alerts/summary`, { signal: controller.signal }),
      axios.get(`${API}/api/orders`, { signal: controller.signal }),
    ]).then(([metricsRes, alertsRes, summaryRes, ordersRes]) => {
      if (metricsRes.status === "fulfilled") setMetrics(metricsRes.value.data)
      if (alertsRes.status === "fulfilled") setAlerts(alertsRes.value.data)
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data.summary)
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data)

      const allFailed = [metricsRes, alertsRes, summaryRes, ordersRes].every(r => r.status === "rejected")
      if (allFailed) setError("Couldn't reach the server. Please try again later.")

      setLoading(false)
    })

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div>
        <div className="page-title">Dashboard</div>
        <div className="card">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-title">Dashboard</div>
      {error && <div className="alert-banner alert-critical">{error}</div>}
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
          {orders.length === 0 ? (
            <div className="empty-state">No orders yet.</div>
          ) : (
            <table>
              <thead><tr><th>ID</th><th>Customer</th><th>Status</th></tr></thead>
              <tbody>{orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer}</td>
                  <td><span className={badgeClass[o.status] || "badge badge-gray"}>{o.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div className="card-title">AI Alerts</div>
          {alerts.length === 0 ? (
            <div className="empty-state">No alerts.</div>
          ) : (
            alerts.map(a => (
              <div key={a.id} className={alertClass[a.severity] || "alert-item alert-info"}>{a.message}</div>
            ))
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">7-Day Demand Forecast</div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={demandData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: "#898781", fontSize: 12 }} axisLine={{ stroke: "#383835" }} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: "#898781", fontSize: 12 }} axisLine={{ stroke: "#383835" }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#c3c2b7" }}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#c3c2b7" }} />
              {Object.keys(DEMAND_SERIES).map(product => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={DEMAND_COLORS[product]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: DEMAND_COLORS[product] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}