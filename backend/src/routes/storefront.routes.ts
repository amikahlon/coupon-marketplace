import { Router } from "express";
import { storefrontController } from "../controllers/storefront.controller";
import { validateUuidParam } from "../middleware/validate";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

router.get("/", asyncHandler(storefrontController.list));
router.get(
  "/:productId",
  validateUuidParam("productId"),
  asyncHandler(storefrontController.getById),
);
// No body: the customer cannot choose a price; it is fixed at the minimum
router.post(
  "/:productId/purchase",
  validateUuidParam("productId"),
  asyncHandler(storefrontController.purchase),
);

export default router;
