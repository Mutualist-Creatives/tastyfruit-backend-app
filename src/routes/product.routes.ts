import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validations/product.validation.js";

const router = Router();

router.get(
  "/",
  validate(productQuerySchema), // Validate query params
  productController.getProducts
);

router.get("/:id", productController.getProduct);

router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete("/:id", authenticate, productController.deleteProduct);

export default router;
