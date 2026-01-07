import { IngredientesRepository } from "../repositories/ingredientes.repository";
import { Ingredientes } from "../entities/ingredientes.entities";

export class IngredientesService {
  static async listarIngredientes(recetaId: string): Promise<Ingredientes[]> {
    return await IngredientesRepository.find({
      where: { receta: { id: recetaId } },
      relations: { receta: true },
    });
  }

  static async agregarIngrediente(
    recetaId: string,
    nombre: string,
    calorias: number
  ): Promise<Ingredientes> {
    const nuevoIngrediente = IngredientesRepository.create({
      nombre,
      calorias,
      receta: { id: recetaId },
    });
    return await IngredientesRepository.save(nuevoIngrediente);
  }

  static async eliminarrIngrediente(ingredienteId: string): Promise<boolean> {
    const result = await IngredientesRepository.delete({ id: ingredienteId });
    return !!result.affected && result.affected > 0;
  }
}
