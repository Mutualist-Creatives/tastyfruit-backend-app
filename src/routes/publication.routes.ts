import { Router } from "express";
import * as publicationController from "../controllers/publication.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createPublicationSchema,
  updatePublicationSchema,
  publicationQuerySchema,
} from "../validations/publication.validation.js";

const router = Router();

router.get(
  "/",
  validate(publicationQuerySchema),
  publicationController.getPublications
);
router.get("/:id", publicationController.getPublication);

router.post(
  "/",
  authenticate,
  validate(createPublicationSchema),
  publicationController.createPublication
);

router.put(
  "/:id",
  authenticate,
  validate(updatePublicationSchema),
  publicationController.updatePublication
);

router.delete("/:id", authenticate, publicationController.deletePublication);

export default router;
