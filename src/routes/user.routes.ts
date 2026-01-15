import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from "../validations/user.validation.js";

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);
// Require admin role for all user management routes
router.use(requireRole("admin"));

router.get("/", validate(userQuerySchema), userController.getUsers);
router.get("/:id", userController.getUser);

router.post("/", validate(createUserSchema), userController.createUser);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
