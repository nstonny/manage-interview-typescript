import { Request, Response, Router, NextFunction } from "express";
import { User } from "../models/user";
import { authenticate } from "../middlewares/authenticate";
import * as _ from "lodash";
import { validateObjectID } from "../middlewares/validateObjectID";
import { successhandler } from "../middlewares/successhandler";

export class UserRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    public async addUser(req: Request, res: Response, next: NextFunction) {
        try {
            const body = _.pick(req.body, ["firstName", "lastName", "email", "password"]);
            const user = new User({ ...body });
            const result = await user.save();
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            successhandler(token, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public async logoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            await req.body.user.removeToken(req.body.token);
            const result = [];
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public routes() {
        this.router.post("/", this.addUser);
        this.router.post("/login", this.loginUser);
        this.router.delete("/logout", authenticate, this.logoutUser);
    }
}
const userRouter = new UserRouter();
userRouter.routes();
export default userRouter.router;
