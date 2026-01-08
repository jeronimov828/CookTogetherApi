import { Response } from "express";
import { UsuariosService } from "../services/usuarios.service";
import { AuthRequest } from "../types/express.d";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { NotFoundError, UnauthorizedError, ConflictError } from "../utils/errors";

const usuarioService = new UsuariosService();

export class UsuarioController {
  async obtenerTodo(_req: AuthRequest, res: Response) {
    const usuarios = await usuarioService.obtenerTodo();
    res.json(usuarios);
  }

  async obtenerPorId(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const usuario = await usuarioService.buscarUsuario({ id });
    
    if (!usuario) {
      throw new NotFoundError("Usuario");
    }

    // No devolver la contraseña
    const { passwordHash, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  }

  async crearUsuario(req: AuthRequest, res: Response) {
    const { name, email, passwordHash, role = "user" } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await usuarioService.buscarUsuario({ email });
    if (usuarioExistente) {
      throw new ConflictError("El email ya está registrado");
    }

    const usuarioExistentePorNombre = await usuarioService.buscarUsuario({ name });
    if (usuarioExistentePorNombre) {
      throw new ConflictError("El nombre de usuario ya está en uso");
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordHash, salt);

    // Crear usuario
    const usuario = await usuarioService.crearUsuario({
      name,
      email,
      passwordHash: hashedPassword,
      role,
    });

    // No devolver la contraseña
    const { passwordHash: _, ...usuarioSinPassword } = usuario;
    res.status(201).json(usuarioSinPassword);
  }

  async actualizarUsuario(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await usuarioService.buscarUsuario({ id });
    if (!usuarioExistente) {
      throw new NotFoundError("Usuario");
    }

    // Verificar permisos: solo puede actualizar su propio perfil o ser admin
    if (req.user?.id !== id && req.user?.role !== "admin") {
      throw new UnauthorizedError("No tienes permisos para actualizar este usuario");
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== usuarioExistente.email) {
      const emailEnUso = await usuarioService.buscarUsuario({ email });
      if (emailEnUso) {
        throw new ConflictError("El email ya está registrado");
      }
    }

    // Solo admin puede cambiar roles
    const datosActualizacion: any = {};
    if (name) datosActualizacion.name = name;
    if (email) datosActualizacion.email = email;
    if (role && req.user?.role === "admin") datosActualizacion.role = role;

    const usuarioActualizado = await usuarioService.actualizarUsuario(id, datosActualizacion);
    const { passwordHash: _, ...usuarioSinPassword } = usuarioActualizado;
    res.json(usuarioSinPassword);
  }

  async cambiarPassword(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const usuario = await usuarioService.buscarUsuario({ id });
    if (!usuario) {
      throw new NotFoundError("Usuario");
    }

    // Verificar permisos
    if (req.user?.id !== id && req.user?.role !== "admin") {
      throw new UnauthorizedError("No tienes permisos para cambiar esta contraseña");
    }

    // Verificar contraseña actual (solo si no es admin cambiando otra cuenta)
    if (req.user?.id === id) {
      const validarContrasena = await bcrypt.compare(
        currentPassword,
        usuario.passwordHash
      );
      if (!validarContrasena) {
        throw new UnauthorizedError("Contraseña actual incorrecta");
      }
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await usuarioService.actualizarUsuario(id, { passwordHash: hashedPassword });
    res.json({ mensaje: "Contraseña actualizada exitosamente" });
  }

  async login(req: AuthRequest, res: Response) {
    const { name, passwordHash } = req.body;

    const buscaUsuario = await usuarioService.buscarUsuario({ name });
    if (!buscaUsuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const validarContrasena = await bcrypt.compare(
      passwordHash,
      buscaUsuario.passwordHash
    );

    if (!validarContrasena) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = jwt.sign(
      {
        id: buscaUsuario.id,
        name: buscaUsuario.name,
        role: buscaUsuario.role,
      },
      env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { passwordHash: _, ...usuarioSinPassword } = buscaUsuario;
    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: usuarioSinPassword,
      token,
    });
  }

  async eliminarUsuario(req: AuthRequest, res: Response) {
    const { id } = req.params;

    const usuario = await usuarioService.buscarUsuario({ id });
    if (!usuario) {
      throw new NotFoundError("Usuario");
    }

    await usuarioService.eliminarUsuario({ id });
    res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
  }
}
