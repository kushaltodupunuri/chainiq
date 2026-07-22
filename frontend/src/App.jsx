import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Orders from "./pages/Orders"
import Suppliers from "./pages/Suppliers"
import "./App.css"

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">Chain<span>IQ</span></div>
      <NavLink to="/" end className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Dashboard</NavLink>
      <NavLink to="/inventory" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Inventory</NavLink>
      <NavLink to="/orders" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Orders</NavLink>
      <NavLink to="/suppliers" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Suppliers</NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{background:"#030712", minHeight:"100vh"}}>
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}