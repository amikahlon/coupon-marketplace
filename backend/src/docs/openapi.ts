const errorResponse = {
  description: "Error",
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Error" } },
  },
};

const productIdParam = {
  name: "productId",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Coupon Marketplace API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:4000" }],
  tags: [
    { name: "Reseller", description: "External reseller API (Bearer token)." },
    { name: "Storefront", description: "Public customer-facing API." },
    { name: "Admin", description: "Coupon management (Bearer token)." },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer" },
    },
    schemas: {
      PublicProduct: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string" },
          price: { type: "number", example: 100 },
        },
      },
      PurchaseResult: {
        type: "object",
        properties: {
          product_id: { type: "string", format: "uuid" },
          final_price: { type: "number", example: 120 },
          value_type: { type: "string", enum: ["STRING", "IMAGE"] },
          value: { type: "string", example: "AMZN-100-ABCD-1234" },
        },
      },
      AdminCoupon: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string" },
          type: { type: "string", example: "COUPON" },
          cost_price: { type: "number" },
          margin_percentage: { type: "number" },
          minimum_sell_price: { type: "number" },
          is_sold: { type: "boolean" },
          value_type: { type: "string", enum: ["STRING", "IMAGE"] },
          value: { type: "string" },
        },
      },
      ResellerPurchase: {
        type: "object",
        required: ["reseller_price"],
        properties: { reseller_price: { type: "number", example: 120 } },
      },
      CreateCoupon: {
        type: "object",
        required: [
          "name",
          "description",
          "image_url",
          "cost_price",
          "margin_percentage",
          "value_type",
          "value",
        ],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string" },
          cost_price: { type: "number", example: 80 },
          margin_percentage: { type: "number", example: 25 },
          value_type: { type: "string", enum: ["STRING", "IMAGE"] },
          value: { type: "string" },
        },
      },
      UpdateCoupon: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string" },
          cost_price: { type: "number" },
          margin_percentage: { type: "number" },
          value_type: { type: "string", enum: ["STRING", "IMAGE"] },
          value: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error_code: { type: "string", example: "PRODUCT_NOT_FOUND" },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/v1/products": {
      get: {
        tags: ["Reseller"],
        summary: "List available coupons",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PublicProduct" },
                },
              },
            },
          },
          401: errorResponse,
        },
      },
    },
    "/api/v1/products/{productId}": {
      get: {
        tags: ["Reseller"],
        summary: "Get one coupon",
        security: [{ bearerAuth: [] }],
        parameters: [productIdParam],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicProduct" },
              },
            },
          },
          404: errorResponse,
        },
      },
    },
    "/api/v1/products/{productId}/purchase": {
      post: {
        tags: ["Reseller"],
        summary: "Purchase a coupon at reseller_price",
        security: [{ bearerAuth: [] }],
        parameters: [productIdParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResellerPurchase" },
            },
          },
        },
        responses: {
          200: {
            description: "Purchased",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PurchaseResult" },
              },
            },
          },
          400: errorResponse,
          404: errorResponse,
          409: errorResponse,
        },
      },
    },
    "/api/storefront/products": {
      get: {
        tags: ["Storefront"],
        summary: "List available coupons",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PublicProduct" },
                },
              },
            },
          },
        },
      },
    },
    "/api/storefront/products/{productId}": {
      get: {
        tags: ["Storefront"],
        summary: "Get one coupon",
        parameters: [productIdParam],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicProduct" },
              },
            },
          },
          404: errorResponse,
        },
      },
    },
    "/api/storefront/products/{productId}/purchase": {
      post: {
        tags: ["Storefront"],
        summary: "Purchase at the fixed minimum price",
        parameters: [productIdParam],
        responses: {
          200: {
            description: "Purchased",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PurchaseResult" },
              },
            },
          },
          404: errorResponse,
          409: errorResponse,
        },
      },
    },
    "/api/admin/products": {
      get: {
        tags: ["Admin"],
        summary: "List all coupons (sold + unsold)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AdminCoupon" },
                },
              },
            },
          },
          401: errorResponse,
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Create a coupon",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCoupon" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminCoupon" },
              },
            },
          },
          400: errorResponse,
          401: errorResponse,
        },
      },
    },
    "/api/admin/products/{productId}": {
      get: {
        tags: ["Admin"],
        summary: "Get one coupon (full)",
        security: [{ bearerAuth: [] }],
        parameters: [productIdParam],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminCoupon" },
              },
            },
          },
          404: errorResponse,
        },
      },
      patch: {
        tags: ["Admin"],
        summary: "Update a coupon",
        security: [{ bearerAuth: [] }],
        parameters: [productIdParam],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCoupon" },
            },
          },
        },
        responses: {
          200: {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminCoupon" },
              },
            },
          },
          404: errorResponse,
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete a coupon",
        security: [{ bearerAuth: [] }],
        parameters: [productIdParam],
        responses: {
          204: { description: "Deleted" },
          404: errorResponse,
        },
      },
    },
  },
};
