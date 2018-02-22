import { Request, Response, Router } from "express";
import { User } from "../models/user";
import { authenticate } from "../middlewares/authenticate";
import * as _ from "lodash";

export class UserRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    public async createUser(req: Request, res: Response) {
        try {
            const body = _.pick(req.body, ["firstName", "lastName", "email", "password"]);
            const user = new User({ ...body });
            const data = await user.save();
            const token = await user.generateAuthToken();
            const status = res.statusCode;
            res.header("x-auth", token).json({
                status,
                data
            });
        } catch (err) {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
        }
    }
    public authenticateUser(req: Request, res: Response) {
        res.send(req.body.user);
    }
    public async loginUser(req: Request, res: Response) {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            const status = res.statusCode;
            res.header("x-auth", token).json({
                status,
                user
            });
        } catch (err) {
            res.status(400);
            res.json({
                status: res.statusCode,
                err
            });
        }
    }
    public async logoutUser(req: Request, res: Response) {
        try {
            await req.body.user.removeToken(req.body.token);
            const status = res.statusCode;
            res.json({
                status
            });
        } catch (err) {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
        }
    }
    public routes() {
        this.router.post("/", this.createUser);
        this.router.get("/me", authenticate, this.authenticateUser);
        this.router.post("/login", this.loginUser);
        this.router.delete("/logout", authenticate, this.logoutUser);
    }
}
const userRouter = new UserRouter();
userRouter.routes();
export default userRouter.router;
