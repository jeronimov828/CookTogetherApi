import { RecetasRepository } from "../repositories/recetas.repository";
import { Receta } from "../entities/receta.entities";
import { User } from "../entities/usuarios.entities";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { FindOptionsWhere, ILike } from "typeorm";

interface PaginacionOptions {
  page?: number;
  limit?: number;
}

interface BuscarRecetasOptions extends PaginacionOptions {
  titulo?: string;
  dificultad?: string;
  tiempo_max?: number;
  autorId?: string;
  is_Public?: boolean;
}

export class RecetasService {
  static async crearReceta(data: Partial<Receta> & { autor: User }): Promise<Receta> {
    const ingredientesConUsuario = data.ingredientes?.map((ingrediente) => ({
      ...ingrediente,
      usuario: data.autor,
    }));

    const receta = RecetasRepository.create({
      ...data,
      ingredientes: ingredientesConUsuario,
    });

    return await RecetasRepository.save(receta);
  }

  static async listarRecetas(
    autorId: string,
    options: PaginacionOptions = {}
  ): Promise<{ recetas: Receta[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [recetas, total] = await RecetasRepository.findAndCount({
      where: { autor: { id: autorId } },
      relations: { autor: true, ingredientes: true, pasos: true },
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    return {
      recetas,
      total,
      page,
      limit,
    };
  }

  static async listarRecetasPublicas(
    options: BuscarRecetasOptions = {}
  ): Promise<{ recetas: Receta[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, titulo, dificultad, tiempo_max } = options;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Receta> = {
      is_Public: true,
    };

    if (titulo) {
      where.titulo = ILike(`%${titulo}%`);
    }

    if (dificultad) {
      where.dificultad = dificultad;
    }

    if (tiempo_max) {
      where.tiempo_min = tiempo_max as any; // TypeORM necesita un operador para esto
    }

    const queryBuilder = RecetasRepository.createQueryBuilder("receta")
      .leftJoinAndSelect("receta.autor", "autor")
      .leftJoinAndSelect("receta.ingredientes", "ingredientes")
      .leftJoinAndSelect("receta.pasos", "pasos")
      .where("receta.is_Public = :isPublic", { isPublic: true })
      .orderBy("receta.createdAt", "DESC");

    if (titulo) {
      queryBuilder.andWhere("receta.titulo ILIKE :titulo", { titulo: `%${titulo}%` });
    }

    if (dificultad) {
      queryBuilder.andWhere("receta.dificultad = :dificultad", { dificultad });
    }

    if (tiempo_max) {
      queryBuilder.andWhere("receta.tiempo_min <= :tiempoMax", { tiempoMax: tiempo_max });
    }

    const [recetas, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      recetas,
      total,
      page,
      limit,
    };
  }

  static async obtenerRecetaPorId(id: string, autorId?: string): Promise<Receta> {
    const receta = await RecetasRepository.findOne({
      where: { id },
      relations: { autor: true, ingredientes: true, pasos: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    // Si la receta no es pública, solo el autor puede verla
    if (!receta.is_Public && receta.autor.id !== autorId) {
      throw new UnauthorizedError("No tienes permisos para ver esta receta");
    }

    return receta;
  }

  static async actualizarReceta(
    id: string,
    data: Partial<Receta>,
    autorId: string
  ): Promise<Receta> {
    const receta = await RecetasRepository.findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    // Solo el autor puede actualizar su receta
    if (receta.autor.id !== autorId) {
      throw new UnauthorizedError("No tienes permisos para actualizar esta receta");
    }

    await RecetasRepository.update({ id }, data);

    const recetaActualizada = await RecetasRepository.findOne({
      where: { id },
      relations: { autor: true, ingredientes: true, pasos: true },
    });

    if (!recetaActualizada) {
      throw new NotFoundError("Receta");
    }

    return recetaActualizada;
  }

  static async publicarRecetas(
    data: { id: string; is_Public: boolean },
    autorId: string
  ): Promise<Receta> {
    const receta = await RecetasRepository.findOne({
      where: { id: data.id },
      relations: { autor: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    // Solo el autor puede publicar/despublicar su receta
    if (receta.autor.id !== autorId) {
      throw new UnauthorizedError("No tienes permisos para publicar esta receta");
    }

    await RecetasRepository.update({ id: data.id }, { is_Public: data.is_Public });

    const recetaActualizada = await RecetasRepository.findOne({
      where: { id: data.id },
      relations: { autor: true, ingredientes: true, pasos: true },
    });

    if (!recetaActualizada) {
      throw new NotFoundError("Receta");
    }

    return recetaActualizada;
  }

  static async eliminarReceta(id: string, autorId: string): Promise<Receta> {
    const receta = await RecetasRepository.findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!receta) {
      throw new NotFoundError("Receta");
    }

    // Solo el autor puede eliminar su receta
    if (receta.autor.id !== autorId) {
      throw new UnauthorizedError("No tienes permisos para eliminar esta receta");
    }

    await RecetasRepository.delete({ id });
    return receta;
  }
}
