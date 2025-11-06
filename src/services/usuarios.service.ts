import { UsuariosRepository } from "../repositories/usuarios.repository";
import { User } from "../entities/usuarios.entities";

export class UsuariosService {
  async obtenerTodo(): Promise<User[]> {
    return await UsuariosRepository.find();
  }

  async crearUsuario(
    data: Partial<User>,
    hashedPassword: string
  ): Promise<User> {
    const user = UsuariosRepository.create(data);
    return await UsuariosRepository.save(user);
  }

  async buscarUsuario(where: Partial<User>): Promise<User | null> {
    return await UsuariosRepository.findOneBy(where);
  }

  async eliminarUsuario(where: Partial<User>): Promise<User | null> {
    const user = await UsuariosRepository.findOne({
      where
    });

    if (!user) return null;

    await UsuariosRepository.delete(where);
    return user;
  }
}