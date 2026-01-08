import { Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AuthRequest } from "../types/express.d";
import { IngredientesService } from "../services/ingredientes.services";
import { Receta } from "../entities/receta.entities";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { IngredientesRepository } from "../repositories/ingredientes.repository";

export class IngredientesController {
  async listarIngredientes(req: AuthRequest, res: Response) {
    const { id } = req.params;

    // Verificar que la receta existe
    const receta = await AppDataSource.getRepository(Receta).findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    // Si la receta no es pública, solo el autor puede verla
    if (!receta.is_Public && receta.autor.id !== req.user?.id) {
      throw new UnauthorizedError("No tienes permisos para ver esta receta");
    }

    const ingredientes = await IngredientesService.listarIngredientes(id);
    res.status(200).json(ingredientes);
  }

  async agregarIngredientes(req: AuthRequest, res: Response) {
    const recetaId = req.params.id;
    const { nombre, calorias } = req.body;

    if (!nombre) {
      res.status(400).json({ error: "El nombre del ingrediente es obligatorio" });
      return;
    }

    // Verificar que la receta existe y pertenece al usuario
    const receta = await AppDataSource.getRepository(Receta).findOne({
      where: { id: recetaId },
      relations: { autor: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    if (receta.autor.id !== req.user!.id) {
      throw new UnauthorizedError("No tienes permisos para modificar esta receta");
    }

    const resultado = await IngredientesService.agregarIngrediente(
      recetaId,
      nombre,
      calorias
    );
    res.status(201).json(resultado);
  }

  async eliminarIngrediente(req: AuthRequest, res: Response) {
    const { id } = req.params;

    // Buscar el ingrediente para verificar que existe y obtener la receta
    const ingrediente = await IngredientesRepository.findOne({
      where: { id },
      relations: { receta: { autor: true } },
    });

    if (!ingrediente) {
      throw new NotFoundError("Ingrediente");
    }

    // Verificar permisos
    if (ingrediente.receta.autor.id !== req.user!.id) {
      throw new UnauthorizedError("No tienes permisos para eliminar este ingrediente");
    }

    const eliminado = await IngredientesService.eliminarIngrediente(id);

    if (!eliminado) {
      throw new NotFoundError("Ingrediente");
    }

    res.status(200).json({
      mensaje: "Ingrediente eliminado exitosamente",
    });
  }
}
