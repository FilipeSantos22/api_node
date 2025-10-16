import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];
    
    if (!header) {
        return res.status(401).json({ message: 'Token ausente' });
    }

    const parts = (header as string).split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token inválido' });
    }

    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);

        (req as any).user = payload;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
