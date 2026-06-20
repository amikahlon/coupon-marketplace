import type {
  PublicProduct,
  PurchaseResult,
  AdminCoupon,
  CreateCouponBody,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function bearer(token: string): Record<string, string> {
  const clean = [...token]
    .filter((ch) => ch.charCodeAt(0) <= 255)
    .join("")
    .trim();
  return { Authorization: `Bearer ${clean}` };
}

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
  // Customer (public)
  listCoupons: () => request<PublicProduct[]>("/api/storefront/products"),
  buyAsCustomer: (id: string) =>
    request<PurchaseResult>(`/api/storefront/products/${id}/purchase`, {
      method: "POST",
    }),

  // Admin
  listAdmin: (token: string) =>
    request<AdminCoupon[]>("/api/admin/products", { headers: bearer(token) }),
  createCoupon: (token: string, body: CreateCouponBody) =>
    request<AdminCoupon>("/api/admin/products", {
      method: "POST",
      headers: bearer(token),
      body: JSON.stringify(body),
    }),
};
