import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuariosRepository } from '../repositories/usuarios.repository';


const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export class AuthService {

    async register(data: any) {

        const hashed = await bcrypt.hash(data.senha, 10);
        const created = await UsuariosRepository.create({ ...data, senha: hashed });
        const { senha, ...rest } = created as any;

        return rest;
    }

    async login(email: string, senha: string) {
        const user = await UsuariosRepository.findAll().then(list => list.find(u => u.email === email));
        if (!user) {
            throw { statusCode: 401, message: 'Credenciais inválidas' };
        }

        const valid = await bcrypt.compare(senha, (user as any).senha);
        if (!valid) {
            throw { statusCode: 401, message: 'Credenciais inválidas' };
        }

        const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
        return token;
    }

    verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET);
    }
}
