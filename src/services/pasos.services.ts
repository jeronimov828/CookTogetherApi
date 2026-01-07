import { pasos } from "../entities/pasos.entities";
import { pasosRepository } from "../repositories/pasos.repository";
import { RecetasRepository } from "../repositories/recetas.repository";

export class pasosService {
  async agregarPasos(
    recetaId: string,
    listaPasos: { orden: number; contenido: string }[]
  ) {
    const receta = await RecetasRepository.findOneBy({ id: recetaId });
    if (!receta) throw new Error("Receta no encontrada");

    const nuevosPasos = listaPasos.map((p) => {
      const pasoEntity = new pasos();
      pasoEntity.orden = p.orden;
      pasoEntity.contenido = p.contenido;
      pasoEntity.receta = receta;
      return pasoEntity;
    });

    await pasosRepository.save(nuevosPasos);
    return nuevosPasos;
  }

  static async ListarPasos(recetaId: string): Promise<pasos[]> {
    return await pasosRepository.find({
      where: { receta: { id: recetaId } },
      relations: { receta: true }
    });
  }

  static async eliminarPasos (idPaso: string): Promise<boolean> {
    const result = await pasosRepository.delete({id: idPaso});
    return !!result.affected && result.affected > 0;
  }
}
