import { Request, Response, NextFunction } from "express";
import { ObjectID } from "mongodb";

export const validateObjectID = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectID.isValid(req.params.id)) {
        res.status(404).json({
            status: res.statusCode,
            message: "invalid ObjectID"
        });
    }
    next();
};
