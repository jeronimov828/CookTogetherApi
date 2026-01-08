import { Paso } from "../entities/pasos.entities";
import { PasosRepository } from "../repositories/pasos.repository";
import { RecetasRepository } from "../repositories/recetas.repository";
import { NotFoundError } from "../utils/errors";

export class PasosService {
  async agregarPasos(
    recetaId: string,
    listaPasos: { orden: number; contenido: string }[]
  ): Promise<Paso[]> {
    const receta = await RecetasRepository.findOneBy({ id: recetaId });
    if (!receta) throw new NotFoundError("Receta");

    const nuevosPasos = listaPasos.map((p) => {
      const pasoEntity = new Paso();
      pasoEntity.orden = p.orden;
      pasoEntity.contenido = p.contenido;
      pasoEntity.receta = receta;
      return pasoEntity;
    });

    await PasosRepository.save(nuevosPasos);
    return nuevosPasos;
  }

  static async listarPasos(recetaId: string): Promise<Paso[]> {
    return await PasosRepository.find({
      where: { receta: { id: recetaId } },
      relations: { receta: true },
      order: { orden: "ASC" },
    });
  }

  static async eliminarPasos(idPaso: string): Promise<boolean> {
    const result = await PasosRepository.delete({ id: idPaso });
    return !!result.affected && result.affected > 0;
  }
}
