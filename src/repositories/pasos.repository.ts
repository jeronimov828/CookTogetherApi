import { AppDataSource } from "../config/data-source";
import { Paso } from "../entities/pasos.entities";

export const PasosRepository = AppDataSource.getRepository(Paso);