import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import AvailabilityRouter from "./routers/AvailabilityRouter";
import CandidateRouter from "./routers/candidateRouter";
import EmployeeRouter from "./routers/employeeRouter";
import UserRouter from "./routers/userRouter";
import { errorhandler } from "./middlewares/errorhandler";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger/api_doc.json";
import * as cors from "cors";

// Server class
class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.database();
        this.middleware();
        this.routes();
        this.app.use(this.notFound);
        this.app.use(errorhandler);
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
                message: "Welcome to Manage Interview App"
            });
        });
        this.app.use("/", router);
        this.app.use("/api/v1/users", UserRouter);
        this.app.use("/api/v1/employees", EmployeeRouter);
        this.app.use("/api/v1/candidates", CandidateRouter);
        this.app.use("/api/v1/availabilities", AvailabilityRouter);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
    private middleware(): void {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(logger("dev"));
    }
    private notFound(req: express.Request, res: express.Response, next: express.NextFunction) {
        const err = new Error("page not found");
        res.statusCode = 404;
        next(err);
    }
}
export default new Server().app;
