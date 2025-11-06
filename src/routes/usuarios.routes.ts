import { Router } from "express";
import { UsuarioController } from "../controller/usuarios.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/authmiddleware";

const Usuariosrouter = Router();
const controller = new UsuarioController();

Usuariosrouter.get(
  "/",
  authMiddleware, adminMiddleware,
  controller.obtenerTodo.bind(controller)
);
Usuariosrouter.post("/", authMiddleware, adminMiddleware, controller.crearUsuario.bind(controller));
Usuariosrouter.post("/login", controller.login.bind(controller));
Usuariosrouter.delete("/eliminaUsuario/:id", authMiddleware, adminMiddleware, controller.eliminarUsuario.bind(controller));

export default Usuariosrouter;
