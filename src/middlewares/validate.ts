import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateBody = (schema: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    req.body = value;
    next();
  } catch (e: any) {
    res.status(400).json({ message: "Validation error", details: e.details?.map((d: any) => d.message) ?? [e.message] });
  }
};

export const validateQuery = (schema: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await schema.validateAsync(req.query, { abortEarly: false, stripUnknown: true });
    req.query = value as any;
    next();
  } catch (e: any) {
    res.status(400).json({ message: "Validation error", details: e.details?.map((d: any) => d.message) ?? [e.message] });
  }
};

