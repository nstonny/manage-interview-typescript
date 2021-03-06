import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("x-auth");
        const user = await User.findByToken(token);
        if (!user) {
            Promise.reject("unauthorized");
        }
        req.body.user = user;
        req.body.token = token;
        next();
    } catch (err) {
        err = new Error ("unauthorized");
        res.statusCode = 401;
        next(err);
    }
};
