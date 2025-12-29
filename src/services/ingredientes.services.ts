import { IngredientesRepository } from "../repositories/ingredientes.repository";
import { User } from "../entities/usuarios.entities";
import { Receta } from "../entities/receta.entities";
import { Ingredientes } from "../entities/ingredientes.entities";

export class IngredientesService {
  static async listarIngredientes(recetaId: string): Promise<Ingredientes[]> {
    return await IngredientesRepository.find({
      where: { receta: { id: recetaId } },
      relations: { receta: true },
    });
  }
}