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
    public getEmployees(req: Request, res: Response): void {
        Employee.find({
            _creator: req.body.user._id
        }).populate("availabilities", "day time")
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
    public getEmployee(req: Request, res: Response): void {
        Employee.find({
            _id: req.params.id,
            _creator: req.body.user._id
        }).populate("availabilities", "day time")
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
    public createEmployee(req: Request, res: Response): void {
        const _creator = req.body.user._id;
        const body = _.pick(req.body, ["firstName", "lastName", "email",
                                       "department", "position", "availabilities"]);
        const employee = new Employee({ ...body, _creator});
        employee.save()
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
    public deleteEmployee(req: Request, res: Response): void {
        Employee.findOneAndRemove({
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
    public updateEmployee(req: Request, res: Response): void {
        Employee.findOneAndUpdate({ _id: req.params.id, _creator: req.body.user._id },
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
