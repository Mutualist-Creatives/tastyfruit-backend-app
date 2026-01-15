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

    const folder = req.body.folder || "tastyfruit";

    const result = await uploadService.uploadImage(req.file, folder);

    sendSuccess(res, result, "File uploaded successfully");
  } catch (error) {
    next(error);
  }
};
