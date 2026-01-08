import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/usuarios.entities";
import { Receta } from "../entities/receta.entities";
import { Ingredientes } from "../entities/ingredientes.entities";
import { Paso } from "../entities/pasos.entities";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === "development", // Solo en desarrollo
  logging: env.NODE_ENV === "development",
  entities: [User, Receta, Ingredientes, Paso],
  migrations: ["src/migrations/**/*.ts"],
  migrationsTableName: "migrations",
});
