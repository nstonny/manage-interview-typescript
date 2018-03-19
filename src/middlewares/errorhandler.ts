import { Request, Response, NextFunction } from "express";

export const errorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const success: boolean = false;
    res.statusCode = (res.statusCode === 200) ? 500 : res.statusCode;
    const code = res.statusCode;
    const result: any = err.message;
    res.json({
        success,
        code,
        result
    });
    next();
};
