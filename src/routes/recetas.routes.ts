import { RecetaController } from "../controller/recetas.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware";

const recetasRouter = Router();
const recetasController = new RecetaController();

recetasRouter.post(
  "/crearRecetas",
  authMiddleware,
  recetasController.crearReceta.bind(recetasController)
);
recetasRouter.get(
  "/listarRecetas",
  authMiddleware,
  recetasController.listarRecetas.bind(recetasController)
);
recetasRouter.put(
  "/publicarReceta/:id",
  authMiddleware,
  recetasController.publicarRecetas.bind(recetasController)
);
recetasRouter.delete(
  "/eliminarReceta/:id",
  authMiddleware,
  recetasController.eliminarReceta.bind(recetasController)
);
export default recetasRouter;
