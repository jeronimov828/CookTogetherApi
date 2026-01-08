import "reflect-metadata";
import express from "express";
import cors from "cors"
import { AppDataSource } from "./config/data-source";
import usuariosRouter from "./routes/usuarios.routes";
import recetasRouter from "./routes/recetas.routes";
import pasosRouter from "./routes/pasos.routes";
import ingredientesRouter from "./routes/ingredientes.router";
import { errorHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";
import path from "path";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rutas
app.use("/apiRecetas/usuarios", usuariosRouter);
app.use("/apiRecetas/recetas", recetasRouter);
app.use("/apiRecetas/pasos", pasosRouter);
app.use("/apiRecetas/ingredientes", ingredientesRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicializar base de datos y servidor
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");
    app.listen(env.PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${env.PORT}`);
      console.log(`📝 Entorno: ${env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  });

export default app;
