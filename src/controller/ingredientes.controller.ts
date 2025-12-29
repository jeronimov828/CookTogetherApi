import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/usuarios.entities";
import { IngredientesService } from "../services/ingredientes.services";
import { Receta } from "../entities/receta.entities";

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
}
