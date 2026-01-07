import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/usuarios.entities";
import { IngredientesService } from "../services/ingredientes.services";
import { Receta } from "../entities/receta.entities";
import { validate as isUUID } from "uuid";

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ingredientesController {
  async listarIngredientes(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;
      const { id } = req.params;

      const usuario = AppDataSource.getRepository(User).findOneBy({
        id: user_id,
      });

      if (!id) {
        return res.status(400).json({ error: "Falta el ID de la receta" });
      }

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const receta = await AppDataSource.getRepository(Receta).findOne({
        where: { id, autor: { id: (await usuario).id } },
        relations: { autor: true },
      });

      if (!receta) {
        return res
          .status(404)
          .json({ error: "Receta no encontrada o no pertenece al usuario" });
      }

      const ingredientes = await IngredientesService.listarIngredientes(id);
      return res.status(200).json(ingredientes);
    } catch (error) {
      console.error("Error al listar ingredientes:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async agregarIngredientes(req: AuthRequest, res: Response) {
    try {
      const recetaId = req.params.id;
      const { nombre, calorias } = req.body;

      const usuario_id = req.user?.id;

      const usuario = await AppDataSource.getRepository(User).findOneBy({
        id: usuario_id,
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!nombre || calorias == null) {
        return res
          .status(400)
          .json({ error: "Faltan datos del ingrediente (nombre o calorías)" });
      }

      const resultado = await IngredientesService.agregarIngrediente(
        recetaId,
        nombre,
        calorias
      );
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ mensaje: (error as Error).message });
    }
  }

  async eliminarIngrediente(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // 1. Validar que exista
      if (!id) {
        return res.status(400).json({
          error: "El ID del ingrediente es requerido",
        });
      }

      // 2. Validar que sea UUID
      if (!isUUID(id)) {
        return res.status(400).json({
          error: "El ID del ingrediente no es un UUID válido",
        });
      }

      // 3. Eliminar
      const eliminado = await IngredientesService.eliminarrIngrediente(id);

      // 4. Si no se eliminó nada
      if (!eliminado) {
        return res.status(404).json({
          error: "El ingrediente no existe",
        });
      }

      // 5. Éxito
      return res.status(200).json({
        mensaje: "Ingrediente eliminado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error interno del servidor",
        detalle: (error as Error).message,
      });
    }
  }
}
