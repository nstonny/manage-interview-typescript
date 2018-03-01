import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import AvailabilityRouter from "./routers/AvailabilityRouter";
import CandidateRouter from "./routers/candidateRouter";
import EmployeeRouter from "./routers/employeeRouter";
import UserRouter from "./routers/userRouter";

// Server class
class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.database();
        this.middleware();
        this.routes();
    }
    private async database() {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB connected to ${process.env.MONGODB_URI}`);
        } catch (err) {
            console.log(err);
        }
    }
    private routes(): void {
        const router: express.Router = express.Router();
        router.get("/", (req, res, next) => {
            res.json({
                message: "Hello World!"
            });
        });
        this.app.use("/", router);
        this.app.use("/api/v1/users", UserRouter);
        this.app.use("/api/v1/empolyees", EmployeeRouter);
        this.app.use("/api/v1/candidates", CandidateRouter);
        this.app.use("/api/v1/availabilities", AvailabilityRouter);
    }
    private middleware() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(logger("dev"));
    }
}
export default new Server().app;
