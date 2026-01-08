import { Response } from "express";
import { RecetasService } from "../services/recetas.services";
import { AuthRequest } from "../types/express.d";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/usuarios.entities";
import { NotFoundError } from "../utils/errors";

export class RecetaController {
  private async obtenerUsuarioAutenticado(userId: string): Promise<User> {
    const usuario = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });

    if (!usuario) {
      throw new NotFoundError("Usuario");
    }

    return usuario;
  }

  async crearReceta(req: AuthRequest, res: Response) {
    const {
      titulo,
      descripcion,
      dificultad,
      porciones,
      tiempo_min,
      imagen_Url,
      ingredientes,
      pasos,
    } = req.body;

    const usuario = await this.obtenerUsuarioAutenticado(req.user!.id);

    const receta = await RecetasService.crearReceta({
      titulo,
      descripcion,
      dificultad,
      porciones,
      tiempo_min,
      imagen_Url,
      ingredientes,
      pasos,
      autor: usuario,
    });

    res.status(201).json(receta);
  }

  async listarRecetas(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const resultado = await RecetasService.listarRecetas(req.user!.id, {
      page,
      limit,
    });

    res.status(200).json(resultado);
  }

  async listarRecetasPublicas(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { titulo, dificultad, tiempo_max } = req.query;

    const resultado = await RecetasService.listarRecetasPublicas({
      page,
      limit,
      titulo: titulo as string,
      dificultad: dificultad as string,
      tiempo_max: tiempo_max ? parseInt(tiempo_max as string) : undefined,
    });

    res.status(200).json(resultado);
  }

  async obtenerRecetaPorId(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const autorId = req.user?.id;

    const receta = await RecetasService.obtenerRecetaPorId(id, autorId);
    res.status(200).json(receta);
  }

  async actualizarReceta(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      dificultad,
      porciones,
      tiempo_min,
      imagen_Url,
      is_Public,
    } = req.body;

    const recetaActualizada = await RecetasService.actualizarReceta(
      id,
      {
        titulo,
        descripcion,
        dificultad,
        porciones,
        tiempo_min,
        imagen_Url,
        is_Public,
      },
      req.user!.id
    );

    res.status(200).json({
      mensaje: "Receta actualizada correctamente",
      receta: recetaActualizada,
    });
  }

  async publicarRecetas(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { is_Public } = req.body;

    if (typeof is_Public === "undefined") {
      res.status(400).json({ error: "El campo is_Public es obligatorio" });
      return;
    }

    const recetaActualizada = await RecetasService.publicarRecetas(
      {
        id,
        is_Public,
      },
      req.user!.id
    );

    res.status(200).json({
      mensaje: "Estado de publicación actualizado correctamente",
      receta: recetaActualizada,
    });
  }

  async eliminarReceta(req: AuthRequest, res: Response) {
    const { id } = req.params;

    const recetaEliminada = await RecetasService.eliminarReceta(id, req.user!.id);

    res.status(200).json({
      mensaje: "Receta eliminada correctamente",
      receta: recetaEliminada,
    });
  }
}
