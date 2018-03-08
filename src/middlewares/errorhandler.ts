import { Request, Response, NextFunction } from "express";

export const errorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.statusCode = (res.statusCode === 200) ? 500 : res.statusCode;
    res.json({
        error: true,
        error_msg: err.message,
        error_code: res.statusCode
    });
    next();
};
