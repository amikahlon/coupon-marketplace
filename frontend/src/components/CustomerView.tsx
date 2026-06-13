import { useEffect, useState } from "react";
import { api } from "../api";
import type { PublicProduct, PurchaseResult } from "../types";

export function CustomerView() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<PurchaseResult | null>(null);

  async function loadProducts() {
    const data = await api.listCoupons();
    setProducts(data);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialProducts() {
      try {
        const data = await api.listCoupons();

        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function buy(id: string) {
    try {
      const result = await api.buyAsCustomer(id);

      setPurchased(result);
      await loadProducts();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {purchased && (
        <div className="banner">
          Purchased for ${purchased.final_price}! Your code:{" "}
          <strong>{purchased.value}</strong>
        </div>
      )}

      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image_url} alt={product.name} />

            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>

            <button onClick={() => buy(product.id)}>Buy</button>
          </div>
        ))}

        {products.length === 0 && <p>No coupons available.</p>}
      </div>
    </div>
  );
}
