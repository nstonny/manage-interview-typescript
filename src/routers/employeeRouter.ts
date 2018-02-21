import {Request, Response, Router } from "express";
import Employee from "../models/employee";
import { authenticate } from "../middlewares/authenticate";
import { validateObjectID } from "../middlewares/validateObjectID";

export class EmployeeRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getEmployees(req: Request, res: Response): void {
        const status = res.statusCode;
        Employee.find({
            _creator: req.body.user._id
        }).populate("availabilities", "day time")
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
    public getEmployee(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Employee.find({
            _id,
            _creator
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
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const email: string = req.body.email;
        const department: string = req.body.department;
        const position: string = req.body.position;
        const availabilities: string[] = req.body.availabilities;
        const _creator = req.body.user._id;

        const employee = new Employee({
            firstName,
            lastName,
            email,
            department,
            position,
            availabilities,
            _creator
        });
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
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Employee.findOneAndRemove({
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
    public updateEmployee(req: Request, res: Response): void {
        const _id = req.params.id;
        const _creator = req.body.user._id;
        Employee.findOneAndUpdate({ _id, _creator }, { $set: req.body }, { runValidators: true, new: true })
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
