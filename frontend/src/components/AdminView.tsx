import { useState } from "react";
import { api } from "../api";
import type { AdminCoupon, CreateCouponBody } from "../types";

const EMPTY_FORM: CreateCouponBody = {
  name: "",
  description: "",
  image_url: "",
  cost_price: 0,
  margin_percentage: 0,
  value_type: "STRING",
  value: "",
};

export function AdminView() {
  const [token, setToken] = useState("");
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [form, setForm] = useState<CreateCouponBody>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function loadCoupons() {
    try {
      const data = await api.listAdmin(token);
      setCoupons(data);
      setError(null);
      setLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function createCoupon() {
    try {
      await api.createCoupon(token, form);
      setForm(EMPTY_FORM);
      setError(null);
      await loadCoupons();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function updateField<K extends keyof CreateCouponBody>(
    key: K,
    value: CreateCouponBody[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="admin-auth">
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button onClick={loadCoupons} disabled={!token}>
          Load coupons
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <h2>Create coupon</h2>
      <div className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => updateField("image_url", e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost price"
          value={form.cost_price}
          onChange={(e) => updateField("cost_price", Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Margin %"
          value={form.margin_percentage}
          onChange={(e) =>
            updateField("margin_percentage", Number(e.target.value))
          }
        />
        <select
          value={form.value_type}
          onChange={(e) =>
            updateField("value_type", e.target.value as "STRING" | "IMAGE")
          }
        >
          <option value="STRING">STRING</option>
          <option value="IMAGE">IMAGE</option>
        </select>
        <input
          placeholder="Value (code / image URL)"
          value={form.value}
          onChange={(e) => updateField("value", e.target.value)}
        />
        <button onClick={createCoupon} disabled={!token}>
          Create
        </button>
      </div>

      <h2>All coupons</h2>
      {!loaded && <p>Enter your admin token and click “Load coupons”.</p>}
      <div className="grid">
        {coupons.map((c) => (
          <div key={c.id} className="card">
            <img src={c.image_url} alt={c.name} />
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <p className="meta">
              cost ${c.cost_price} · margin {c.margin_percentage}% · min $
              {c.minimum_sell_price}
            </p>
            <p className="meta">value: {c.value}</p>
            <p className={c.is_sold ? "sold" : "available"}>
              {c.is_sold ? "SOLD" : "Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
