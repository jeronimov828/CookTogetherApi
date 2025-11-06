import { Request, Response } from "express";
import { pasosService } from "../services/pasos.services";
import { User } from "../entities/usuarios.entities";
import { AppDataSource } from "../config/data-source";
import { Receta } from "../entities/receta.entities";

const PasosService = new pasosService();

interface AuthRequest extends Request {
  user?: { id: string };
}

export class PasosController {
  async crearPasosReceta(req: AuthRequest, res: Response) {
    try {
      const recetaId = req.params.id;
      const pasos = req.body.pasos;

      const usuario_id = req.user?.id;

      const usuario = await AppDataSource.getRepository(User).findOneBy({
        id: usuario_id,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const resultado = await PasosService.agregarPasos(recetaId, pasos);
      res.json(resultado);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }

  async listarPasosReceta(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params; // <-- ID de la receta viene por la URL
      const userId = req.user?.id; // <-- el usuario autenticado

      if (!id) {
        return res.status(400).json({ error: "Falta el ID de la receta" });
      }

      // Verificar que el usuario existe
      const usuario = await AppDataSource.getRepository(User).findOneBy({
        id: userId,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // 🔹 Buscar la receta y validar que pertenezca al usuario
      const receta = await AppDataSource.getRepository(Receta).findOne({
        where: { id, autor: { id: usuario.id } },
        relations: { autor: true },
      });

      if (!receta) {
        return res
          .status(404)
          .json({ error: "Receta no encontrada o no pertenece al usuario" });
      }

      // 🔹 Listar los pasos asociados a esa receta
      const pasos = await pasosService.ListarPasos(id);

      return res.status(200).json(pasos);
    } catch (error) {
      console.error("Error al listar los pasos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
