import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receta } from "./receta.entities";

@Entity()
export class pasos {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orden: number;

  @Column("text")
  contenido: string;

  @ManyToOne(() => Receta, (Receta) => Receta.pasos, {
    onDelete: "CASCADE",
  })
  receta: Receta;
}
