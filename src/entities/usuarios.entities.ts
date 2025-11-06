// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Receta } from "./receta.entities";
import { Ingredientes } from "./ingredientes.entities";

@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: string;

  @OneToMany(() => Receta, (r) => r.autor)
  recetas: Receta[];

  @OneToMany(() => Ingredientes, (ingrediente) => ingrediente.usuario)
  ingredientes: Ingredientes[];

  @CreateDateColumn()
  createdAt: Date;
}
