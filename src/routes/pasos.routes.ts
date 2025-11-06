import { authMiddleware } from "../middlewares/authmiddleware";
import { PasosController } from "../controller/pasos.controller";
import { Router } from "express";

const pasosRouter = Router();
const pasosController = new PasosController();

pasosRouter.post(
  "/crearPasos/:id",
  authMiddleware,
  pasosController.crearPasosReceta.bind(pasosController)
);
pasosRouter.get(
  "/listarPasos/:id",
  authMiddleware,
  pasosController.listarPasosReceta.bind(pasosController)
);
  export default pasosRouter;