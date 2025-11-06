import { AppDataSource } from "../config/data-source";
import { Receta } from "../entities/receta.entities";

export const RecetasRepository = AppDataSource.getRepository(Receta);