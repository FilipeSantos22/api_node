import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = err?.statusCode ?? 500;
    const message = err?.message ?? 'Erro interno do servidor';

    console.error(err);

    const payload: any = { status, message };
        if (process.env.NODE_ENV !== 'production') {
    payload.stack = err?.stack;
        if (err?.details) payload.details = err.details;
    }

    res.status(status).json(payload);
}
