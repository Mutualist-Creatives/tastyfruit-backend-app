import { Request, Response, NextFunction } from "express";
import * as uploadService from "../services/upload.service.js";
import { sendSuccess, sendBadRequest } from "../utils/response.util.js";

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return sendBadRequest(res, "No file uploaded");
    }

    let folder = req.body.folder || "publication";
    const allowedFolders = ["publication", "recipe"];

    if (!allowedFolders.includes(folder)) {
      return sendBadRequest(
        res,
        "Invalid folder. Allowed: publication, recipe"
      );
    }

    const result = await uploadService.uploadImage(req.file, folder);

    sendSuccess(res, result, "File uploaded successfully");
  } catch (error) {
    next(error);
  }
};
