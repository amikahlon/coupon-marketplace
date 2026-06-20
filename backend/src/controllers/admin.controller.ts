import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";

// Full coupon data for admin

export const adminController = {
  async list(_req: Request, res: Response) {
    res.json(await couponService.adminList());
  },

  async getById(req: Request, res: Response) {
    res.json(await couponService.adminGetById(req.params.productId));
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await couponService.adminCreate(req.body));
  },

  async update(req: Request, res: Response) {
    res.json(await couponService.adminUpdate(req.params.productId, req.body));
  },

  async remove(req: Request, res: Response) {
    await couponService.adminDelete(req.params.productId);
    res.status(204).send();
  },
};
