import { Coupon, Prisma } from "@prisma/client";

export function calculateMinimumSellPrice(
  coupon: Pick<Coupon, "costPrice" | "marginPercentage">,
): Prisma.Decimal {
  const factor = coupon.marginPercentage.div(100).plus(1); // 1 + margin/100
  return coupon.costPrice.mul(factor).toDecimalPlaces(2);
}
