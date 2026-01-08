import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receta } from "./receta.entities";

@Entity("pasos")
export class Paso {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  orden!: number;

  @Column("text")
  contenido!: string;

  @ManyToOne(() => Receta, (receta) => receta.pasos, {
    onDelete: "CASCADE",
  })
  receta!: Receta;
}
