-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('COUPON');

-- CreateEnum
CREATE TYPE "CouponValueType" AS ENUM ('STRING', 'IMAGE');

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "cost_price" DECIMAL(12,2) NOT NULL,
    "margin_percentage" DECIMAL(6,2) NOT NULL,
    "is_sold" BOOLEAN NOT NULL DEFAULT false,
    "sold_at" TIMESTAMP(3),
    "value_type" "CouponValueType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_product_id_key" ON "coupons"("product_id");

-- CreateIndex
CREATE INDEX "coupons_is_sold_idx" ON "coupons"("is_sold");

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
