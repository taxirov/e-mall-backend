import { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const started = Date.now();
  const { method, url } = req;
  const ip = req.ip;
  console.log(`[REQ] ${method} ${url} from ${ip}`);
  res.on('finish', () => {
    const ms = Date.now() - started;
    console.log(`[RES] ${method} ${url} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[ERR]', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal Server Error', error: typeof err === 'string' ? err : err?.message });
}

