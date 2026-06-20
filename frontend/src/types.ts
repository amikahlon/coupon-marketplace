export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

export interface PurchaseResult {
  product_id: string;
  final_price: number;
  value_type: "STRING" | "IMAGE";
  value: string;
}

export interface AdminCoupon {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: string;
  cost_price: number;
  margin_percentage: number;
  minimum_sell_price: number;
  is_sold: boolean;
  value_type: "STRING" | "IMAGE";
  value: string;
}

export interface CreateCouponBody {
  name: string;
  description: string;
  image_url: string;
  cost_price: number;
  margin_percentage: number;
  value_type: "STRING" | "IMAGE";
  value: string;
}
