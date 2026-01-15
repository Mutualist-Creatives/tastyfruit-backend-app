import { Request, Response, NextFunction } from "express";
import * as publicationService from "../services/publication.service.js";
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
} from "../utils/response.util.js";

export const getPublications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || undefined;

    const result = await publicationService.getAllPublications(
      page,
      limit,
      search,
      category
    );
    sendPaginated(res, result.publications, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getPublication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const publication = await publicationService.getPublicationById(
      id as string
    );
    sendSuccess(res, publication);
  } catch (error) {
    next(error);
  }
};

export const createPublication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publication = await publicationService.createPublication(req.body);
    sendCreated(res, publication);
  } catch (error) {
    next(error);
  }
};

export const updatePublication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const publication = await publicationService.updatePublication(
      id as string,
      req.body
    );
    sendSuccess(res, publication);
  } catch (error) {
    next(error);
  }
};

export const deletePublication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await publicationService.deletePublication(id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
