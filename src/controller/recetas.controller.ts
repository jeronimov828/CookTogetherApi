import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/usuarios.entities";
import { RecetasService } from "../services/recetas.services";

interface AuthRequest extends Request {
  user?: { name: string };
}

export class RecetaController {
  async crearReceta(req: AuthRequest, res: Response) {
    try {
      const {
        titulo,
        descripcion,
        dificultad,
        porciones,
        tiempo_min,
        imagen_Url,
        ingredientes,
      } = req.body;

      const usuario_name = req.user?.name;

      const usuario = await AppDataSource.getRepository(User).findOneBy({
        name: usuario_name,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (
        !titulo ||
        !descripcion ||
        !dificultad ||
        !porciones ||
        !tiempo_min ||
        !ingredientes ||
        ingredientes.length === 0
      ) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const receta = await RecetasService.crearReceta({
        titulo,
        descripcion,
        dificultad,
        porciones,
        tiempo_min,
        imagen_Url: imagen_Url,
        ingredientes,
        autor: usuario, // 👈 asegúrate de que en la entidad se llame así
      });

      return res.status(201).json(receta);
    } catch (error) {
      console.error("Error al crear receta:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async listarRecetas(req: AuthRequest, res: Response) {
    try {
      const user_name = req.user.name;
      const usuario = AppDataSource.getRepository(User).findOneBy({
        name: user_name,
      });

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const usuarioEncontrado = await usuario;
      if (!usuarioEncontrado) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const recetas = await RecetasService.listarRecetas(
        usuarioEncontrado.name
      );
      return res.status(200).json(recetas);
    } catch (error) {
      console.error("Error al listar recetas:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async publicarRecetas(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { is_Public } = req.body;

      // Validar que se haya enviado la información necesaria
      if (!id || typeof is_Public === "undefined") {
        return res
          .status(400)
          .json({ error: "Faltan datos: id o estado público" });
      }

      // Buscar el usuario autenticado
      const usuario_name = req.user?.name;
      const usuario = await AppDataSource.getRepository(User).findOneBy({
        name: usuario_name,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Llamar al servicio para actualizar la receta
      const recetaActualizada = await RecetasService.publicarRecetas({
        id,
        is_Public,
      });

      return res.status(200).json({
        mensaje: "Estado de publicación actualizado correctamente",
        receta: recetaActualizada,
      });
    } catch (error) {
      console.error("Error al publicar receta:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async eliminarReceta(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Buscar el usuario autenticado
      const usuario_name = req.user?.name;
      const usuario = await AppDataSource.getRepository(User).findOneBy({
        name: usuario_name,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const eliminarRecetas = await RecetasService.eliminarReceta({
        id,
      });

      return res.status(200).json({
        mensaje: "Se elimino correctamente",
        receta: eliminarRecetas,
      });
    } catch (error: any) {
      console.error("Error al eliminar receta:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
