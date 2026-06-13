import { z } from "zod";

// Only reseller_price is allowed.
export const resellerPurchaseSchema = z.object({
  reseller_price: z.coerce.number().positive(),
});
