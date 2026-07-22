import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://chainiq-yid1.onrender.com"

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/orders`).then(r => setOrders(r.data))
  }, [])

  const statusColor = {
    delivered: "bg-green-800 text-green-300",
    shipped: "bg-yellow-800 text-yellow-300",
    packing: "bg-blue-800 text-blue-300",
    pending: "bg-gray-700 text-gray-300"
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-800">
              <th className="text-left pb-3">Order ID</th>
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Product</th>
              <th className="text-left pb-3">Qty</th>
              <th className="text-left pb-3">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}