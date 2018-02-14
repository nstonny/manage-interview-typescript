import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import { User } from "../models/user";
import { authenticate } from "../middlewares/authenticate";

export class UserRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public async createUser(req: Request, res: Response) {
        try {
            const firstName: string = req.body.firstName;
            const lastName: string = req.body.lastName;
            const email: string = req.body.email;
            const password: string = req.body.password;
            const user = new User({
                firstName,
                lastName,
                email,
                password
            });
            await user.save();
            const token = await user.generateAuthToken();
            const status = res.statusCode;
            res.header("x-auth", token).json({
                status,
                user
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
            const email: string = req.body.email;
            const password: string = req.body.password;
            const user = await User.findByCredentials(email, password);
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
    public routes() {
        this.router.post("/", this.createUser);
        this.router.get("/me", authenticate, this.authenticateUser);
        this.router.post("/login", this.loginUser);
    }
}
const userRouter = new UserRouter();
userRouter.routes();
export default userRouter.router;
