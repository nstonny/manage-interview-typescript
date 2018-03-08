import { Request, Response, NextFunction } from "express";
import { ObjectID } from "mongodb";

export const validateObjectID = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectID.isValid(req.params.id)) {
        const err = new Error("invalid ObjectID");
        res.statusCode = 404;
        next(err);
    }
    next();
};
