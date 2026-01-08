import { Response } from "express";
import { PasosService } from "../services/pasos.services";
import { AuthRequest } from "../types/express.d";
import { AppDataSource } from "../config/data-source";
import { Receta } from "../entities/receta.entities";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { PasosRepository } from "../repositories/pasos.repository";

const pasosService = new PasosService();

export class PasosController {
  async crearPasosReceta(req: AuthRequest, res: Response) {
    const recetaId = req.params.id;
    const pasos = req.body.pasos;

    if (!Array.isArray(pasos) || pasos.length === 0) {
      res.status(400).json({ error: "Debe proporcionar al menos un paso" });
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

    const resultado = await pasosService.agregarPasos(recetaId, pasos);
    res.status(201).json(resultado);
  }

  async listarPasosReceta(req: AuthRequest, res: Response) {
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

    const pasos = await PasosService.listarPasos(id);
    res.status(200).json(pasos);
  }

  async eliminarPasos(req: AuthRequest, res: Response) {
    const { id } = req.params;

    // Buscar el paso para verificar que existe y obtener la receta
    const paso = await PasosRepository.findOne({
      where: { id },
      relations: { receta: { autor: true } },
    });

    if (!paso) {
      throw new NotFoundError("Paso");
    }

    // Verificar permisos
    if (paso.receta.autor.id !== req.user!.id) {
      throw new UnauthorizedError("No tienes permisos para eliminar este paso");
    }

    const eliminado = await PasosService.eliminarPasos(id);

    if (!eliminado) {
      throw new NotFoundError("Paso");
    }

    res.status(200).json({
      mensaje: "Paso eliminado exitosamente",
    });
  }
}
