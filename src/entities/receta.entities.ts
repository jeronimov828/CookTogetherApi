import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { User } from "./usuarios.entities";
import { Ingredientes } from "./ingredientes.entities";
import { pasos } from "./pasos.entities";

@Entity("recetas")
export class Receta {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column("text")
  descripcion: string;

  @Column({
    type: "varchar",
    length: 20,
  })
  dificultad: string;

  @Column({ type: "int" })
  porciones: number;

  @Column({ type: "int" })
  tiempo_min: number;

  @Column({ name: "imagen_url", type: "varchar", length: 50000, nullable: true })
  imagen_Url: string;

  @Column({ name: "is_public", default: false })
  is_Public: boolean;

  @ManyToOne(() => User, (user) => user.recetas, { onDelete: "CASCADE" })
  autor: User;

  @OneToMany(() => pasos, (s) => s.receta, { cascade: true })
  pasos: pasos[];

  @OneToMany(() => Ingredientes, (ingrediente) => ingrediente.receta, {
    cascade: true, // guarda los ingredientes automáticamente con la receta
  })
  ingredientes: Ingredientes[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
