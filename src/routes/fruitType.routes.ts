import { Router } from "express";
import * as fruitTypeController from "../controllers/fruitType.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

const createFruitTypeSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  description: z.string().optional(),
  productId: z.string().min(1),
  slug: z.string().optional(),
});

const updateFruitTypeSchema = createFruitTypeSchema.partial();

router.get("/", fruitTypeController.getFruitTypes);
router.get("/:id", fruitTypeController.getFruitType);

router.post(
  "/",
  authenticate,
  validate(createFruitTypeSchema),
  fruitTypeController.createFruitType
);

router.put(
  "/:id",
  authenticate,
  validate(updateFruitTypeSchema),
  fruitTypeController.updateFruitType
);

router.delete("/:id", authenticate, fruitTypeController.deleteFruitType);

export default router;
