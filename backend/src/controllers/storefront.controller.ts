import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";

// Customer channel: public reads + purchase at the fixed minimum price
export const storefrontController = {
  async list(_req: Request, res: Response) {
    res.json(await couponService.listAvailable());
  },

  async getById(req: Request, res: Response) {
    res.json(await couponService.getPublicById(req.params.productId));
  },

  async purchase(req: Request, res: Response) {
    res.json(await couponService.purchaseAsCustomer(req.params.productId));
  },
};
