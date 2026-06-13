import { CustomerView } from "./components/CustomerView";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Coupon Marketplace</h1>
      </header>
      <main>
        <CustomerView />
      </main>
    </div>
  );
}
