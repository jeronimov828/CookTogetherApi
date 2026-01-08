import { Router } from "express";
import { IngredientesController } from "../controller/ingredientes.controller";
import { authMiddleware } from "../middlewares/authmiddleware";
import { idParamValidator } from "../validators/receta.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const ingredientesRouter = Router();
const ingredientesController = new IngredientesController();

ingredientesRouter.get(
  "/listarIngredientes/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  ingredientesController.listarIngredientes.bind(ingredientesController)
);

ingredientesRouter.post(
  "/agregarIngrediente/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  ingredientesController.agregarIngredientes.bind(ingredientesController)
);

ingredientesRouter.delete(
  "/eliminarIngredientes/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  ingredientesController.eliminarIngrediente.bind(ingredientesController)
);

export default ingredientesRouter;
