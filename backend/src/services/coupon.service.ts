import { Prisma } from "@prisma/client";
import { couponRepository } from "../repositories/coupon.repository";
import { CreateCouponInput, UpdateCouponInput } from "../types/coupon.types";
import { calculateMinimumSellPrice } from "./pricing.service";
import {
  toPublicProduct,
  toPurchaseResult,
  toAdminCoupon,
} from "./coupon.mapper";
import {
  ProductNotFoundError,
  ProductAlreadySoldError,
  ResellerPriceTooLowError,
} from "../errors/app-error";

export const couponService = {
  async listAvailable() {
    const products = await couponRepository.findAvailable();
    return products.map(toPublicProduct);
  },

  async getPublicById(id: string) {
    const product = await couponRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return toPublicProduct(product);
  },

  async purchaseAsCustomer(productId: string) {
    const product = await couponRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (product.coupon.isSold) {
      throw new ProductAlreadySoldError();
    }

    const finalPrice = calculateMinimumSellPrice(product.coupon);

    // Prevent selling the same coupon twice!
    const sold = await couponRepository.markAsSold(productId);

    if (!sold) {
      throw new ProductAlreadySoldError();
    }

    return toPurchaseResult(product, finalPrice.toNumber());
  },

  async purchaseAsReseller(productId: string, resellerPrice: number) {
    const product = await couponRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (product.coupon.isSold) {
      throw new ProductAlreadySoldError();
    }

    const minimum = calculateMinimumSellPrice(product.coupon);

    if (new Prisma.Decimal(resellerPrice).lessThan(minimum)) {
      throw new ResellerPriceTooLowError(minimum.toNumber());
    }

    // Prevent selling the same coupon twice!
    const sold = await couponRepository.markAsSold(productId);

    if (!sold) {
      throw new ProductAlreadySoldError();
    }

    return toPurchaseResult(product, resellerPrice);
  },

  async adminList() {
    const products = await couponRepository.findAll();
    return products.map(toAdminCoupon);
  },

  async adminGetById(id: string) {
    const product = await couponRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return toAdminCoupon(product);
  },

  async adminCreate(input: CreateCouponInput) {
    const product = await couponRepository.create(input);
    return toAdminCoupon(product);
  },

  async adminUpdate(id: string, input: UpdateCouponInput) {
    const existing = await couponRepository.findById(id);

    if (!existing) {
      throw new ProductNotFoundError();
    }

    const product = await couponRepository.update(id, input);

    return toAdminCoupon(product);
  },

  async adminDelete(id: string) {
    const existing = await couponRepository.findById(id);

    if (!existing) {
      throw new ProductNotFoundError();
    }

    await couponRepository.deleteById(id);
  },
};
