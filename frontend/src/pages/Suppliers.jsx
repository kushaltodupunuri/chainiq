import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://chainiq-yid1.onrender.com"

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/suppliers`).then(r => setSuppliers(r.data))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Suppliers</h1>
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