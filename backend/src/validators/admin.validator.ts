import { z } from "zod";

export const createCouponSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    image_url: z.string().min(1, "Image URL is required."),
    cost_price: z.coerce
      .number()
      .nonnegative("Cost price must be a number of zero or more."),
    margin_percentage: z.coerce
      .number()
      .nonnegative("Margin percentage must be a number of zero or more."),
    value_type: z.enum(["STRING", "IMAGE"]),
    value: z.string().min(1, "Coupon value is required."),
  })
  .transform((d) => ({
    name: d.name,
    description: d.description,
    imageUrl: d.image_url,
    costPrice: d.cost_price,
    marginPercentage: d.margin_percentage,
    valueType: d.value_type,
    value: d.value,
  }));

export const updateCouponSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty.").optional(),
    description: z.string().min(1, "Description cannot be empty.").optional(),
    image_url: z.string().min(1, "Image URL cannot be empty.").optional(),
    cost_price: z.coerce
      .number()
      .nonnegative("Cost price must be a number of zero or more.")
      .optional(),
    margin_percentage: z.coerce
      .number()
      .nonnegative("Margin percentage must be a number of zero or more.")
      .optional(),
    value_type: z.enum(["STRING", "IMAGE"]).optional(),
    value: z.string().min(1, "Coupon value cannot be empty.").optional(),
  })
  .transform((d) => ({
    name: d.name,
    description: d.description,
    imageUrl: d.image_url,
    costPrice: d.cost_price,
    marginPercentage: d.margin_percentage,
    valueType: d.value_type,
    value: d.value,
  }));
