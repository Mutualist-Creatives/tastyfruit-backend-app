import { Router } from "express";
import * as recipeController from "../controllers/recipe.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeQuerySchema,
} from "../validations/recipe.validation.js";

const router = Router();

router.get("/", validate(recipeQuerySchema), recipeController.getRecipes);
router.get("/:id", recipeController.getRecipe);

router.post(
  "/",
  authenticate,
  validate(createRecipeSchema),
  recipeController.createRecipe
);

router.put(
  "/:id",
  authenticate,
  validate(updateRecipeSchema),
  recipeController.updateRecipe
);

router.delete("/:id", authenticate, recipeController.deleteRecipe);

export default router;
