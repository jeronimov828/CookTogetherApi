import { UsuariosRepository } from "../repositories/usuarios.repository";
import { User } from "../entities/usuarios.entities";

export class UsuariosService {
  async obtenerTodo(): Promise<User[]> {
    return await UsuariosRepository.find({
      select: ["id", "name", "email", "role", "createdAt"],
    });
  }

  async crearUsuario(data: Partial<User>): Promise<User> {
    const user = UsuariosRepository.create(data);
    return await UsuariosRepository.save(user);
  }

  async buscarUsuario(where: Partial<User>): Promise<User | null> {
    return await UsuariosRepository.findOneBy(where);
  }

  async actualizarUsuario(id: string, data: Partial<User>): Promise<User> {
    await UsuariosRepository.update({ id }, data);
    const usuario = await UsuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  async eliminarUsuario(where: Partial<User>): Promise<User | null> {
    const user = await UsuariosRepository.findOne({
      where,
    });

    if (!user) return null;

    await UsuariosRepository.delete(where);
    return user;
  }
}