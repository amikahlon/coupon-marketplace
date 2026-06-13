import { Router } from "express";
import { resellerController } from "../controllers/reseller.controller";
import { resellerAuth } from "../middleware/auth";
import { validateBody, validateUuidParam } from "../middleware/validate";
import { asyncHandler } from "../middleware/async-handler";
import { resellerPurchaseSchema } from "../validators/reseller.validator";

const router = Router();

router.use(resellerAuth); // all reseller endpoints require a Bearer token

router.get("/", asyncHandler(resellerController.list));
router.get(
  "/:productId",
  validateUuidParam("productId"),
  asyncHandler(resellerController.getById),
);
router.post(
  "/:productId/purchase",
  validateUuidParam("productId"),
  validateBody(resellerPurchaseSchema),
  asyncHandler(resellerController.purchase),
);

export default router;
