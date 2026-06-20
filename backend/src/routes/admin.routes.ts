import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { adminAuth } from "../middleware/auth";
import { validateBody, validateUuidParam } from "../middleware/validate";
import { asyncHandler } from "../middleware/async-handler";
import {
  createCouponSchema,
  updateCouponSchema,
} from "../validators/admin.validator";

const router = Router();

router.use(adminAuth); // all admin endpoints require the admin Bearer token

router.get("/", asyncHandler(adminController.list));
router.get(
  "/:productId",
  validateUuidParam("productId"),
  asyncHandler(adminController.getById),
);
router.post(
  "/",
  validateBody(createCouponSchema),
  asyncHandler(adminController.create),
);
router.patch(
  "/:productId",
  validateUuidParam("productId"),
  validateBody(updateCouponSchema),
  asyncHandler(adminController.update),
);
router.delete(
  "/:productId",
  validateUuidParam("productId"),
  asyncHandler(adminController.remove),
);

export default router;
