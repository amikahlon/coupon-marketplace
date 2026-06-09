import { ProductWithCoupon } from "../repositories/coupon.repository";
import { calculateMinimumSellPrice } from "./pricing.service";

// Response returned to customers and resellers.
export function toPublicProduct(product: ProductWithCoupon) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image_url: product.imageUrl,
    price: calculateMinimumSellPrice(product.coupon).toNumber(),
  };
}

// Returned after a successful purchase.
export function toPurchaseResult(
  product: ProductWithCoupon,
  finalPrice: number,
) {
  return {
    product_id: product.id,
    final_price: finalPrice,
    value_type: product.coupon.valueType,
    value: product.coupon.value,
  };
}

// Full coupon details for admin use.
export function toAdminCoupon(product: ProductWithCoupon) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image_url: product.imageUrl,
    type: product.type,
    cost_price: product.coupon.costPrice.toNumber(),
    margin_percentage: product.coupon.marginPercentage.toNumber(),
    minimum_sell_price: calculateMinimumSellPrice(product.coupon).toNumber(),
    is_sold: product.coupon.isSold,
    sold_at: product.coupon.soldAt,
    value_type: product.coupon.valueType,
    value: product.coupon.value,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
}
