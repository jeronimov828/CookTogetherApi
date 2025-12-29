import "reflect-metadata";
import express from "express";
import cors from "cors"
import { AppDataSource } from "./config/data-source";
import Usuariosrouter from "./routes/usuarios.routes";
import recetasRouter from "./routes/recetas.routes";
import pasosRouter from "./routes/pasos.routes";
import ingredientesRouter from "./routes/ingredientes.router";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/apiRecetas/usuarios", Usuariosrouter);
app.use("/apiRecetas/recetas", recetasRouter);
app.use("/apiRecetas/pasos", pasosRouter);
app.use("/apiRecetas/ingredientes", ingredientesRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.error("❌ Error al conectar con la base de datos:", error));
