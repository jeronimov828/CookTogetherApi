import { AppDataSource } from "../config/data-source";
import { Ingredientes } from "../entities/ingredientes.entities";


export const IngredientesRepository = AppDataSource.getRepository(Ingredientes);