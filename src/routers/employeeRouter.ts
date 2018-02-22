import { Request, Response, Router } from "express";
import Employee from "../models/employee";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";
import * as _ from "lodash";

export class EmployeeRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public async getEmployees(req: Request, res: Response) {
        try {
            const data = await Employee.find({
                _creator: req.body.user._id
            })
                .populate("availabilities", "day time");
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
    public async getEmployee(req: Request, res: Response) {
        try {
            const data = await Employee.find({
                _id: req.params.id,
                _creator: req.body.user._id
            }).populate("availabilities", "day time");
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
    public async createEmployee(req: Request, res: Response) {
        try {
            const _creator = req.body.user._id;
            const body = _.pick(req.body, ["firstName", "lastName", "email",
                "department", "position", "availabilities"]);
            const employee = new Employee({ ...body, _creator });
            const data = await employee.save();
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
    public async deleteEmployee(req: Request, res: Response) {
        try {
            const data = await Employee.findOneAndRemove({
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
    public async updateEmployee(req: Request, res: Response) {
        try {
            const data = await Employee.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
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
        this.router.get("/", authenticate, this.getEmployees);
        this.router.get("/:id", [authenticate, validateObjectID], this.getEmployee);
        this.router.post("/", authenticate, this.createEmployee);
        this.router.delete("/:id", [authenticate, validateObjectID], this.deleteEmployee);
        this.router.put("/:id", [authenticate, validateObjectID], this.updateEmployee);
    }
}
// export
const employeeRoutes = new EmployeeRouter();
employeeRoutes.routes();

export default employeeRoutes.router;
