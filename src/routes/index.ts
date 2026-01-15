import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import fruitTypeRoutes from "./fruitType.routes.js";
import recipeRoutes from "./recipe.routes.js";
import publicationRoutes from "./publication.routes.js";
import userRoutes from "./user.routes.js";
import uploadRoutes from "./upload.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/fruit-types", fruitTypeRoutes);
router.use("/recipes", recipeRoutes);
router.use("/publications", publicationRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
