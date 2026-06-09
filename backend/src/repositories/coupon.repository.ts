import { Coupon, Product, ProductType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreateCouponInput, UpdateCouponInput } from "../types/coupon.types";

export type ProductWithCoupon = Product & {
  coupon: Coupon;
};

export const couponRepository = {
  findAvailable(): Promise<ProductWithCoupon[]> {
    return prisma.product.findMany({
      where: {
        type: ProductType.COUPON,
        coupon: {
          isSold: false,
        },
      },
      include: {
        coupon: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as Promise<ProductWithCoupon[]>;
  },

  findAll(): Promise<ProductWithCoupon[]> {
    return prisma.product.findMany({
      where: {
        type: ProductType.COUPON,
      },
      include: {
        coupon: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as Promise<ProductWithCoupon[]>;
  },

  findById(id: string): Promise<ProductWithCoupon | null> {
    return prisma.product.findFirst({
      where: {
        id,
        type: ProductType.COUPON,
      },
      include: {
        coupon: true,
      },
    }) as Promise<ProductWithCoupon | null>;
  },

  create(input: CreateCouponInput): Promise<ProductWithCoupon> {
    return prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        type: ProductType.COUPON,
        coupon: {
          create: {
            costPrice: input.costPrice,
            marginPercentage: input.marginPercentage,
            valueType: input.valueType,
            value: input.value,
          },
        },
      },
      include: {
        coupon: true,
      },
    }) as Promise<ProductWithCoupon>;
  },

  update(id: string, input: UpdateCouponInput): Promise<ProductWithCoupon> {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        coupon: {
          update: {
            costPrice: input.costPrice,
            marginPercentage: input.marginPercentage,
            valueType: input.valueType,
            value: input.value,
          },
        },
      },
      include: {
        coupon: true,
      },
    }) as Promise<ProductWithCoupon>;
  },

  async deleteById(id: string): Promise<void> {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  },

  async markAsSold(productId: string): Promise<boolean> {
    const result = await prisma.coupon.updateMany({
      where: {
        productId,
        isSold: false,
      },
      data: {
        isSold: true,
        soldAt: new Date(),
      },
    });

    // If count is 0, the coupon was already sold.
    return result.count === 1;
  },
};
