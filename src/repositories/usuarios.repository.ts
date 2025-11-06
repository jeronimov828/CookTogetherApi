import { AppDataSource } from "../config/data-source";
import { User } from "../entities/usuarios.entities";

export const UsuariosRepository = AppDataSource.getRepository(User);
