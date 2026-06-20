import { z } from "zod";

// Only reseller_price is allowed.
export const resellerPurchaseSchema = z.object({
  reseller_price: z.coerce
    .number()
    .positive("Reseller price must be a number greater than zero."),
});
