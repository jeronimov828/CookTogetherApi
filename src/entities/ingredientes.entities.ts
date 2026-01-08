import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Receta } from "./receta.entities";
import { User } from "./usuarios.entities";

@Entity("ingredientes")
export class Ingredientes {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ nullable: true })
  calorias?: number;

  @ManyToOne(() => User, (usuario) => usuario.ingredientes, {
    onDelete: "CASCADE",
  })
  usuario!: User;

  @ManyToOne(() => Receta, (receta) => receta.ingredientes, {
    onDelete: "CASCADE", // Si se elimina la receta, se borran sus ingredientes
  })
  @JoinColumn({ name: "recetaId" })
  receta!: Receta;
}