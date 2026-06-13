import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";

export const resellerController = {
  async list(_req: Request, res: Response) {
    res.json(await couponService.listAvailable());
  },

  async getById(req: Request, res: Response) {
    res.json(await couponService.getPublicById(req.params.productId));
  },

  async purchase(req: Request, res: Response) {
    const { reseller_price } = req.body;
    res.json(
      await couponService.purchaseAsReseller(
        req.params.productId,
        reseller_price,
      ),
    );
  },
};
