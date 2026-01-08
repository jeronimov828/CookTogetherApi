import { RecetaController } from "../controller/recetas.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware";
import {
  crearRecetaValidator,
  actualizarRecetaValidator,
  idParamValidator,
  paginacionValidator,
  buscarRecetasValidator,
} from "../validators/receta.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const recetasRouter = Router();
const recetasController = new RecetaController();

// Rutas públicas
recetasRouter.get(
  "/publicas",
  buscarRecetasValidator,
  handleValidationErrors,
  recetasController.listarRecetasPublicas.bind(recetasController)
);

recetasRouter.get(
  "/publicas/:id",
  idParamValidator,
  handleValidationErrors,
  recetasController.obtenerRecetaPorId.bind(recetasController)
);

// Rutas protegidas
recetasRouter.post(
  "/crearRecetas",
  authMiddleware,
  crearRecetaValidator,
  handleValidationErrors,
  recetasController.crearReceta.bind(recetasController)
);

// 🔥 ESTA DEBE IR ANTES QUE /:id
recetasRouter.get(
  "/",
  authMiddleware,
  paginacionValidator,
  handleValidationErrors,
  recetasController.listarRecetas.bind(recetasController)
);

// ❗ TODAS LAS QUE TIENEN :id AL FINAL
recetasRouter.get(
  "/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  recetasController.obtenerRecetaPorId.bind(recetasController)
);

recetasRouter.put(
  "/:id",
  authMiddleware,
  idParamValidator,
  actualizarRecetaValidator,
  handleValidationErrors,
  recetasController.actualizarReceta.bind(recetasController)
);

recetasRouter.put(
  "/publicarReceta/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  recetasController.publicarRecetas.bind(recetasController)
);

recetasRouter.delete(
  "/eliminarReceta/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  recetasController.eliminarReceta.bind(recetasController)
);


export default recetasRouter;
