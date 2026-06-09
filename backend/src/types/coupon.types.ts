import { CouponValueType } from "@prisma/client";

export interface CreateCouponInput {
  name: string;
  description: string;
  imageUrl: string;
  costPrice: number;
  marginPercentage: number;
  valueType: CouponValueType;
  value: string;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;
