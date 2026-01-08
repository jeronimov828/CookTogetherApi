import { authMiddleware } from "../middlewares/authmiddleware";
import { PasosController } from "../controller/pasos.controller";
import { Router } from "express";
import { idParamValidator } from "../validators/receta.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const pasosRouter = Router();
const pasosController = new PasosController();

pasosRouter.post(
  "/crearPasos/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  pasosController.crearPasosReceta.bind(pasosController)
);

pasosRouter.get(
  "/listarPasos/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  pasosController.listarPasosReceta.bind(pasosController)
);

pasosRouter.delete(
  "/eliminarPasos/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  pasosController.eliminarPasos.bind(pasosController)
);

export default pasosRouter;
