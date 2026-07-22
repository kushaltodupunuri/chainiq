import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8080"

export default function Inventory() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/inventory`).then(r => setProducts(r.data))
  }, [])

  const statusColor = {
    "Critical": "bg-red-800 text-red-300",
    "Low": "bg-yellow-800 text-yellow-300",
    "In Stock": "bg-green-800 text-green-300"
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Inventory</h1>
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