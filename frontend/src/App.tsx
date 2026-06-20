import { useState } from "react";
import { CustomerView } from "./components/CustomerView";
import { AdminView } from "./components/AdminView";
import "./App.css";

type Mode = "customer" | "admin";

export default function App() {
  const [mode, setMode] = useState<Mode>("customer");

  return (
    <div className="app">
      <header>
        <h1>Coupon Marketplace</h1>
        <div className="tabs">
          <button
            className={mode === "customer" ? "active" : ""}
            onClick={() => setMode("customer")}
          >
            Customer
          </button>
          <button
            className={mode === "admin" ? "active" : ""}
            onClick={() => setMode("admin")}
          >
            Admin
          </button>
        </div>
      </header>
      <main>{mode === "customer" ? <CustomerView /> : <AdminView />}</main>
    </div>
  );
}
