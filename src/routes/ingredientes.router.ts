import { Router } from "express";
import { ingredientesController } from "../controller/ingredientes.controller";
import { authMiddleware } from "../middlewares/authmiddleware";

const ingredientesRouter = Router();
const IngredienteController = new ingredientesController();

ingredientesRouter.get(
  "/listarIngredientes/:id",
  authMiddleware,
  IngredienteController.listarIngredientes.bind(ingredientesController)
);

export default ingredientesRouter;
