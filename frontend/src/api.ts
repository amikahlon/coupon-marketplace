import type {
  PublicProduct,
  PurchaseResult,
  AdminCoupon,
  CreateCouponBody,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data as T;
}

export const api = {
  listCoupons: () => request<PublicProduct[]>("/api/storefront/products"),
  buyAsCustomer: (id: string) =>
    request<PurchaseResult>(`/api/storefront/products/${id}/purchase`, {
      method: "POST",
    }),

  listAdmin: (token: string) =>
    request<AdminCoupon[]>("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createCoupon: (token: string, body: CreateCouponBody) =>
    request<AdminCoupon>("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
};
