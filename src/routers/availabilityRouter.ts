import { Request, Response, Router, NextFunction} from "express";
import Availability from "../models/availability";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";
import * as _ from "lodash";
import { successhandler } from "../middlewares/successhandler";

export class AvailabilityRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    // should return list of availabilities from seed
    public async getAvailabilities(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Availability.find({
                _creator: req.body.user._id
            });
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    // already get this from employee router-lists availability of an employee
    public async getAvailabilityById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Availability.find({
                _id: req.params.id,
                _creator: req.body.user._id
            }).populate("availabilities", "day time");
            if (!result) {
                const err = new Error ("Data not found");
                res.statusCode = 404;
                next(err);
            }
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public async addAvailability(req: Request, res: Response, next: NextFunction) {
        try {
            const _creator = req.body.user._id;
            const body = _.pick(req.body, ["day", "time"]);
            const availability = new Availability({ ...body, _creator });
            const result = await availability.save();
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    // to be removed after seeding
    public async deleteAvailabilityById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Availability.findOneAndRemove({
                _id: req.params.id,
                _creator: req.body.user._id
            });
            if (!result) {
                const err = new Error ("Data not found");
                res.statusCode = 404;
                next(err);
            }
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    // to be removed after seeding
    public async updateAvailabilityById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Availability.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
                { $set: req.body },
                { runValidators: true, new: true });
            if (!result) {
                const err = new Error ("Data not found");
                res.statusCode = 404;
                next(err);
            }
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public routes() {
        this.router.get("/", authenticate, this.getAvailabilities);
        this.router.post("/", authenticate, this.addAvailability);
        this.router.get("/:id", [authenticate, validateObjectID], this.getAvailabilityById);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteAvailabilityById);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateAvailabilityById);
    }
}
// export
const availabilityRoutes = new AvailabilityRouter();
availabilityRoutes.routes();
export default availabilityRoutes.router;
