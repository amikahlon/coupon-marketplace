export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ProductNotFoundError extends AppError {
  constructor() {
    super(404, "PRODUCT_NOT_FOUND", "The requested product does not exist.");
  }
}

export class ProductAlreadySoldError extends AppError {
  constructor() {
    super(409, "PRODUCT_ALREADY_SOLD", "This product has already been sold.");
  }
}

export class ResellerPriceTooLowError extends AppError {
  constructor(minimumSellPrice: number) {
    super(
      400,
      "RESELLER_PRICE_TOO_LOW",
      `Reseller price must be at least the minimum sell price of ${minimumSellPrice}.`,
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(401, "UNAUTHORIZED", "Missing or invalid authentication token.");
  }
}
