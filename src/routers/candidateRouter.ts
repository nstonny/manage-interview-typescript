import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import Candidate from "../models/candidate";

export class CandidateRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getCandidates(req: Request, res: Response): void {
        const status = res.statusCode;
        Candidate.find({})
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.findById(id)
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
        const interviewers: string = req.body.interviewers;
        const positionAppliedFor: string = req.body.positionAppliedFor;

        const candidate = new Candidate({
            firstName,
            lastName,
            email,
            interviewers,
            positionAppliedFor
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.findByIdAndRemove(id)
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Candidate.findByIdAndUpdate(id, req.body)
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
        this.router.get("/", this.getCandidates);
        this.router.get("/:id", this.getCandidate);
        this.router.post("/", this.createCandidate);
        this.router.delete("/:id", this.deleteCandidate);
        this.router.put("/:id", this.updateCandidate);
    }
}
// export
const candidateRoutes = new CandidateRouter();
candidateRoutes.routes();

export default candidateRoutes.router;
