import { Router } from "express";
import { UsuarioController } from "../controller/usuarios.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/authmiddleware";
import {
  crearUsuarioValidator,
  loginValidator,
  actualizarUsuarioValidator,
  cambiarPasswordValidator,
} from "../validators/usuario.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";
import { idParamValidator } from "../validators/receta.validator";

const usuariosRouter = Router();
const controller = new UsuarioController();

// Rutas públicas
usuariosRouter.post(
  "/login",
  loginValidator,
  handleValidationErrors,
  controller.login.bind(controller)
);

// Rutas protegidas
usuariosRouter.get(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.obtenerTodo.bind(controller)
);

usuariosRouter.get(
  "/:id",
  authMiddleware,
  idParamValidator,
  handleValidationErrors,
  controller.obtenerPorId.bind(controller)
);

usuariosRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  crearUsuarioValidator,
  handleValidationErrors,
  controller.crearUsuario.bind(controller)
);

usuariosRouter.put(
  "/:id",
  authMiddleware,
  idParamValidator,
  actualizarUsuarioValidator,
  handleValidationErrors,
  controller.actualizarUsuario.bind(controller)
);

usuariosRouter.put(
  "/:id/password",
  authMiddleware,
  idParamValidator,
  cambiarPasswordValidator,
  handleValidationErrors,
  controller.cambiarPassword.bind(controller)
);

usuariosRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idParamValidator,
  handleValidationErrors,
  controller.eliminarUsuario.bind(controller)
);

export default usuariosRouter;
