import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import Availability from "../models/availability";

export class AvailabilityRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getAvailabilities(req: Request, res: Response): void {
        const status = res.statusCode;
        Availability.find({})
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Availability.findById(id)
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
        const availability = new Availability({
            day,
            time
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Availability.findByIdAndRemove(id)
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Availability.findByIdAndUpdate(id, req.body)
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
               message: "Data updated"
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
        this.router.get("/", this.getAvailabilities);
        this.router.get("/:id", this.getAvailability);
        this.router.post("/", this.createAvailability);
        this.router.delete("/:id", this.deleteAvailability);
        this.router.put("/:id", this.updateAvailability);
    }
}
// export
const availabilityRoutes = new AvailabilityRouter();
availabilityRoutes.routes();

export default availabilityRoutes.router;
