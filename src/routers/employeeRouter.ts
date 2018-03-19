import { Request, Response, Router, NextFunction } from "express";
import Employee from "../models/employee";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";
import * as _ from "lodash";
import { successhandler } from "../middlewares/successhandler";

export class EmployeeRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public async getEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Employee.find({
                _creator: req.body.user._id
            })
                .populate("availabilities", "day time");
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public async addEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const _creator = req.body.user._id;
            const body = _.pick(req.body, ["firstName", "lastName", "email",
                "department", "position", "availabilities"]);
            const employee = new Employee({ ...body, _creator });
            const result = await employee.save();
            successhandler(result, req, res, next);
        } catch (err) {
            next(err);
        }
    }
    public async getEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Employee.find({
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
    public async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Employee.findOneAndRemove({
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
    public async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Employee.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
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
        this.router.post("/", authenticate, this.addEmployee);
        this.router.get("/", authenticate, this.getEmployees);
        this.router.get("/:id", [authenticate, validateObjectID], this.getEmployee);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteEmployee);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateEmployee);
    }
}
// export
const employeeRoutes = new EmployeeRouter();
employeeRoutes.routes();

export default employeeRoutes.router;
