import { NextFunction, Request, Response, Router } from "express";
import Availability from "../models/availability";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";

export class AvailabilityRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getAvailabilities(req: Request, res: Response): void {
        const status = res.statusCode;
        const _creator = req.body.user._id;
        Availability.find({
            _creator
        })
            .then((data) => {
                res.json({
                    status,
                    data
                });
            })
            .catch((err) => {
                const status = res.statusCode;
                res.json({
                    status,
                    err
                });
            });

    }
    public getAvailability(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Availability.find({
            _id,
            _creator
        })
            .then((data) => {
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
            })
            .catch((err) => {
                const status = res.statusCode;
                res.json({
                    status,
                    err
                });
            });
    }
    public createAvailability(req: Request, res: Response): void {
        const day: string = req.body.day;
        const time: string = req.body.time;
        const _creator = req.body.user._id;
        const availability = new Availability({
            day,
            time,
            _creator
        });
        availability.save()
            .then((data) => {
                const status = res.statusCode;
                res.json({
                    status,
                    data
                });
            })
            .catch((err) => {
                const status = res.statusCode;
                res.json({
                    status,
                    err
                });
            });
    }
    public deleteAvailability(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Availability.findOneAndRemove({
            _id,
            _creator
        })
        .then((data) => {
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
        })
        .catch((err) => {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
        });

    }
    public updateAvailability(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Availability.findOneAndUpdate({ _id, _creator }, { $set: req.body }, { runValidators: true, new: true })
        .then((data) => {
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
        })
        .catch((err) => {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
        });

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
