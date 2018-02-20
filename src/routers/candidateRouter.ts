import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import Candidate from "../models/candidate";
import { authenticate } from "../middlewares/authenticate";

export class CandidateRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getCandidates(req: Request, res: Response): void {
        const status = res.statusCode;
        Candidate.find({
            _creator: req.body.user._id
        })
            .populate({
                path: "employees",
                model: "Employee",
                select: "firstName lastName email department position",
                populate: {
                    path: "availabilities",
                    model: "Availability",
                    select: "day time"
                }
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
    public getCandidate(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        if (!ObjectID.isValid(_id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.find({
            _id,
            _creator
        })
            .populate({
                path: "employees",
                model: "Employee",
                select: "firstName lastName email department position",
                populate: {
                    path: "availabilities",
                    model: "Availability",
                    select: "day time"
                }
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
    public createCandidate(req: Request, res: Response): void {
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const email: string = req.body.email;
        const employees: string[] = req.body.employees;
        const positionAppliedFor: string = req.body.positionAppliedFor;
        const _creator = req.body.user._id;

        const candidate = new Candidate({
            firstName,
            lastName,
            email,
            employees,
            positionAppliedFor,
            _creator
        });
        candidate.save()
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
    public deleteCandidate(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        if (!ObjectID.isValid(_id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.findOneAndRemove({
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
    public updateCandidate(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        if (!ObjectID.isValid(_id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.findOneAndUpdate({ _id, _creator }, { $set: req.body }, { runValidators: true, new: true })
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
        this.router.get("/", authenticate, this.getCandidates);
        this.router.get("/:id", authenticate, this.getCandidate);
        this.router.post("/", authenticate, this.createCandidate);
        this.router.delete("/:id", authenticate, this.deleteCandidate);
        this.router.put("/:id", authenticate, this.updateCandidate);
    }
}
// export
const candidateRoutes = new CandidateRouter();
candidateRoutes.routes();

export default candidateRoutes.router;
