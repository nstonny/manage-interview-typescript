import {Request, Response, NextFunction} from "express";
import {User} from "../models/user";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("x-auth");
        const user = await User.findByToken(token);
        if (!user) {
            res.status(404);
            res.json({
                status: res.statusCode,
                err: "user not found"
            });
        }
        req.body.user = user;
        req.body.token = token;
        next();
    } catch (err) {
        res.status(401);
        res.json({
            status: res.statusCode,
            err
        });
    }
};
