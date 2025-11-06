import { Request, Response } from "express";
import { UsuariosService } from "../services/usuarios.service";
import { AppDataSource } from "../config/data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/usuarios.entities";
import dotenv from "dotenv";
import { toString } from "express-validator/lib/utils";
dotenv.config();

interface AuthRequest extends Request {
  user?: { name: string };
}

const usuarioService = new UsuariosService();

export class UsuarioController {
  async obtenerTodo(req: AuthRequest, res: Response) {
    try {
      const usuario_name = req.user?.name; // ✅ Asegurar que este ID es correcto y proviene del token
      const usuario = await AppDataSource.getRepository(User).findOneBy({
        name: usuario_name,
      });

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const usuarios = await usuarioService.obtenerTodo();
      return res.json(usuarios);
    } catch (error) {
      console.error("Error al listar los usuarios", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  async crearUsuario(req: AuthRequest, res: Response) {
    try {
      const usuario_name = req.user?.name; // ✅ Asegurar que este ID es correcto y proviene del token
      const usuarioDb = await AppDataSource.getRepository(User).findOneBy({
        name: usuario_name,
      });

      if (!usuarioDb) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const { name, email, passwordHash, role } = req.body;

      // Validar campos
      if (!name || !email || !passwordHash || !role) {
        return res
          .status(400)
          .json({ mensaje: "Todos los campos son obligatorios." });
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordHash, salt);

      // Crear usuario (solo pasando lo necesario)
      const usuario = await usuarioService.crearUsuario(
        {
          name,
          email,
          passwordHash: hashedPassword,
          role,
        },
        // Segundo argumento, por ejemplo, opciones adicionales o transacción (ajustar según implementación)
        undefined
      );

      return res.status(201).json(usuario);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { name, passwordHash } = req.body;

      if (!name || !passwordHash) {
        return res
          .status(400)
          .json({ mensaje: "Todos los campos son obligatorios." });
      }

      const buscaUsuario = await usuarioService.buscarUsuario({ name });
      if (!buscaUsuario) {
        return res.status(404).json({ mensaje: "El usuario no existe" });
      }

      const validarContrasena = await bcrypt.compare(
        passwordHash,
        buscaUsuario.passwordHash
      );

      if (!validarContrasena) {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        {
          id: buscaUsuario.id,
          name: buscaUsuario.name,
          role: buscaUsuario.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      // Aquí puedes generar un token o devolver datos del usuario, por ahora respondemos OK
      return res
        .status(200)
        .json({ mensaje: "Login exitoso", usuario: buscaUsuario, token });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  async eliminarUsuario(req: AuthRequest, res: Response) {
    try {
      // id viene de los parámetros o del body
      const { id } = req.params;

      // Validar que se envíe el id
      if (!id) {
        return res
          .status(400)
          .json({ error: "Falta el ID del usuario a eliminar" });
      }

      // Buscar el usuario por ID
      const usuario = await AppDataSource.getRepository(User).findOneBy({ id });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Eliminar el usuario
      const eliminado = await usuarioService.eliminarUsuario({ id });
      if (eliminado) {
        return res
          .status(200)
          .json({ mensaje: "Usuario eliminado exitosamente" });
      } else {
        return res
          .status(500)
          .json({ error: "No se pudo eliminar el usuario" });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}