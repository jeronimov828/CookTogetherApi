import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Errores de TypeORM
  if (err.name === "QueryFailedError") {
    res.status(400).json({
      error: "Error en la consulta a la base de datos",
      ...(env.NODE_ENV === "development" && { details: err.message }),
    });
    return;
  }

  // Error desconocido
  console.error("Error no manejado:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    ...(env.NODE_ENV === "development" && { message: err.message, stack: err.stack }),
  });
};

