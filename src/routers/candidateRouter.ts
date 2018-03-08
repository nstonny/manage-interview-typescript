import { Request, Response, Router, NextFunction } from "express";
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
    public async getCandidates(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Candidate.find({
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
                });
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        } catch (err) {
            next(err);
        }
    }
    public async getCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Candidate.find({
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
                });
            if (!data) {
                const err = new Error ("data not found");
                res.statusCode = 404;
                next(err);
            }
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        } catch (err) {
            next(err);
        }
    }
    public async createCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const _creator = req.body.user._id;
            const body = _.pick(req.body, ["firstName", "lastName", "email",
                "employees", "positionAppliedFor"]);
            const candidate = new Candidate({ ...body, _creator });
            const data = await candidate.save();
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        } catch (err) {
            next(err);
        }
}
    public async deleteCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Candidate.findOneAndRemove({
                _id: req.params.id,
                _creator: req.body.user._id
            });
            if (!data) {
                const err = new Error ("data not found");
                res.statusCode = 404;
                next(err);
            }
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        } catch (err) {
            next(err);
        }
 }
    public async updateCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Candidate.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
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
            next(err);
        }
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
