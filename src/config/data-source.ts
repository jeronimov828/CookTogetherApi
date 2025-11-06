import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/usuarios.entities";
import { Receta } from "../entities/receta.entities";
import { Ingredientes } from "../entities/ingredientes.entities";
import { pasos } from "../entities/pasos.entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "CookTogether",
  synchronize: true, // ⚠️ solo para desarrollo (crea tablas automáticamente)
  logging: true,
  entities: [User, Receta, Ingredientes, pasos],
});
