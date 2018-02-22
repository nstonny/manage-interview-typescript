import { Request, Response, Router } from "express";
import Availability from "../models/availability";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";
import * as _ from "lodash";

export class AvailabilityRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public async getAvailabilities(req: Request, res: Response) {
        try {
            const data = await Availability.find({
                _creator: req.body.user._id
            });
            const status = res.statusCode;
            res.json({
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
    public async getAvailability(req: Request, res: Response) {
        try {
            const data = await Availability.find({
                _id: req.params.id,
                _creator: req.body.user._id
            });
            if (!data) {
                res.status(404).json({
                    status: res.statusCode,
                    message: "Data not found"
                });
            }
            const status = res.statusCode;
            res.json({
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
    public async createAvailability(req: Request, res: Response) {
        try {
            const _creator = req.body.user._id;
            const body = _.pick(req.body, ["day", "time"]);
            const availability = new Availability({ ...body, _creator });
            const data = await availability.save();
            const status = res.statusCode;
            res.json({
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
    public async deleteAvailability(req: Request, res: Response) {
        try {
            const data = await Availability.findOneAndRemove({
                _id: req.params.id,
                _creator: req.body.user._id
            });
            if (!data) {
                res.status(404).json({
                    status: res.statusCode,
                    message: "Data not found"
                });
            }
            const status = res.statusCode;
            res.json({
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
    public async updateAvailability(req: Request, res: Response) {
        try {
            const data = await Availability.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
                { $set: req.body },
                { runValidators: true, new: true });
            if (!data) {
                res.status(404).json({
                    status: res.statusCode,
                    message: "Data not found"
                });
            }
            const status = res.statusCode;
            res.json({
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
    public routes() {
        this.router.get("/", authenticate, this.getAvailabilities);
        this.router.get("/:id", [authenticate, validateObjectID], this.getAvailability);
        this.router.post("/", authenticate, this.createAvailability);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteAvailability);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateAvailability);
    }
}
// export
const availabilityRoutes = new AvailabilityRouter();
availabilityRoutes.routes();

export default availabilityRoutes.router;
