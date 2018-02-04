// import * as compression from 'compression';
import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import CandidateRouter from "./routers/candidateRouter";
import EmployeeRouter from "./routers/employeeRouter";

// import * as helmet from 'helmet';
// import * as cors from 'cors';

// Server class
class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.middleware();
        this.routes();
    }
    public config() {
        // setup mongoose
        const MONGO_URI = "mongodb://localhost/manage-interview";
        mongoose.connect(MONGO_URI || process.env.MONGODB_URI);
    }
    public routes(): void {
        const router: express.Router = express.Router();
        router.get("/", (req, res, next) => {
            res.json({
                message: "Hello World!"
            });
        });
        this.app.use("/", router);
        this.app.use("/api/v1/empolyees", EmployeeRouter);
        this.app.use("/api/v1/candidates", CandidateRouter);
    }
    private middleware() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(logger("dev"));
        // this.app.use(helmet());
        // this.app.use(cors());
    }
}
export default new Server().app;
