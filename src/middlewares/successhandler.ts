import { Request, Response, NextFunction } from "express";

export const successhandler = (result: any, req: Request, res: Response, next: NextFunction) => {
    const success: boolean = true;
    const code: number = res.statusCode;
    res.json({
        success,
        code,
        result
    });
    res.end();
};
