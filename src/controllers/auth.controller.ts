import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private service = new AuthService();

  async register(req: Request, res: Response) {
    const data = req.body;
    const user = await this.service.register(data);
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const token = await this.service.login(email, senha);
    return res.json({ token });
  }
}
