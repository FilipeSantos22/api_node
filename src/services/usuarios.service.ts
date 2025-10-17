import { UsuariosRepository } from '../repositories/usuarios.repository';

export class UsuariosService {
    async listarTodos() {
        return UsuariosRepository.findAll();
    }

    async obterPorId(id: number) {
        return UsuariosRepository.findById(id);
    }

    async atualizar(id: number, data: any) {
        return UsuariosRepository.update(id, data);
    }

    async excluir(id: number) {
        return UsuariosRepository.delete(id);
    }
}
