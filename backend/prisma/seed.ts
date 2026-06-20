import "dotenv/config";
import { PrismaClient, ProductType, CouponValueType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      name: "Amazon $100 Coupon",
      description: "Amazon gift card worth $100.",
      imageUrl: "https://placehold.co/400x300/png?text=Amazon+Coupon",
      type: ProductType.COUPON,
      coupon: {
        create: {
          costPrice: 80,
          marginPercentage: 25,
          valueType: CouponValueType.STRING,
          value: "AMZN-100-ABCD-1234",
        },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Steam $50 Coupon",
      description: "Steam wallet code worth $50.",
      imageUrl: "https://placehold.co/400x300/png?text=Steam+Coupon",
      type: ProductType.COUPON,
      coupon: {
        create: {
          costPrice: 40,
          marginPercentage: 10,
          valueType: CouponValueType.STRING,
          value: "STEAM-50-WXYZ-5678",
        },
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
