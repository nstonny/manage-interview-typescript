import {  Request, Response, Router } from "express";
import Candidate from "../models/candidate";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";
import * as _ from "lodash";

export class CandidateRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getCandidates(req: Request, res: Response): void {
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
    public getCandidate(req: Request, res: Response): void {
        Candidate.find({
            _id: req.params.id,
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
        const _creator = req.body.user._id;
        const body = _.pick(req.body, ["firstName", "lastName", "email",
                                       "employees", "positionAppliedFor"]);
        const candidate = new Candidate({ ...body, _creator });
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
        Candidate.findOneAndRemove({
            _id: req.params.id,
            _creator: req.body.user._id
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
        Candidate.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
            { $set: req.body },
            { runValidators: true, new: true })
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
        this.router.get("/:id", [authenticate, validateObjectID], this.getCandidate);
        this.router.post("/", authenticate, this.createCandidate);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteCandidate);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateCandidate);
    }
}
// export
const candidateRoutes = new CandidateRouter();
candidateRoutes.routes();

export default candidateRoutes.router;
