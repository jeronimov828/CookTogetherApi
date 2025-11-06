import { RecetasRepository } from "../repositories/recetas.repository";
import { Receta } from "../entities/receta.entities";
import { User } from "../entities/usuarios.entities";

export class RecetasService {
  static async crearReceta(data: Partial<Receta> & { autor: User }): Promise<Receta> {
    // 🔹 Agregar el usuario (autor) a cada ingrediente antes de guardar
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

  static async listarRecetas(name: string): Promise<Receta[]> {
    return await RecetasRepository.find({
      where: { autor: { name: name } },
      relations: { autor: true },
    });
  }

  static async publicarRecetas(data: {
    id: string;
    is_Public: boolean;
  }): Promise<Receta> {
    const recetaRepo = RecetasRepository;

    const receta = await recetaRepo.findOne({ where: { id: data.id } });
    if (!receta) throw new Error("Receta no encontrada");

    await recetaRepo.update({ id: data.id }, { is_Public: data.is_Public });

    const recetaActualizada = await recetaRepo.findOne({
      where: { id: data.id },
      relations: { autor: true },
    });

    if (!recetaActualizada) {
      throw new Error("Error al recuperar la receta actualizada");
    }

    return recetaActualizada;
  }

  static async eliminarReceta(data: { id: string }): Promise<Receta> {
    const recetaRepo = RecetasRepository;

    const receta = await recetaRepo.findOne({
      where: { id: data.id },
      relations: { autor: true },
    });

    if (!receta) throw new Error("Receta no encontrada");

    await recetaRepo.delete({ id: data.id });

    return receta;
  };
}
