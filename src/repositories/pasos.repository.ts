import { AppDataSource } from "../config/data-source";
import { pasos } from "../entities/pasos.entities";

export const pasosRepository = AppDataSource.getRepository(pasos);