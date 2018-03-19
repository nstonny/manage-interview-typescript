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

    // get all availabilities
    // get all availabilities for each employee: employee id
    // add availability for an employee: employee id
    // delete availability: availability id
    // update availability: availability id
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
    public async getAvailabilityByEmployeeId(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Availability.find({
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
    public async addAvailabilityByEmployeeId(req: Request, res: Response, next: NextFunction) {
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
    public async deleteAvailabilityByEmployeeId(req: Request, res: Response, next: NextFunction) {
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
    public async updateAvailabilityByEmployeeId(req: Request, res: Response, next: NextFunction) {
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
        this.router.post("/", authenticate, this.addAvailabilityByEmployeeId);
        this.router.get("/:id", [authenticate, validateObjectID], this.getAvailabilityByEmployeeId);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteAvailabilityByEmployeeId);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateAvailabilityByEmployeeId);
    }
}
// export
const availabilityRoutes = new AvailabilityRouter();
availabilityRoutes.routes();
export default availabilityRoutes.router;
