import { z } from "zod";

// Convert API fields to camelCase
export const createCouponSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    image_url: z.string().min(1),
    cost_price: z.coerce.number().nonnegative(),
    margin_percentage: z.coerce.number().nonnegative(),
    value_type: z.enum(["STRING", "IMAGE"]),
    value: z.string().min(1),
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

// Update
export const updateCouponSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image_url: z.string().min(1).optional(),
    cost_price: z.coerce.number().nonnegative().optional(),
    margin_percentage: z.coerce.number().nonnegative().optional(),
    value_type: z.enum(["STRING", "IMAGE"]).optional(),
    value: z.string().min(1).optional(),
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
