import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import Employee from "../models/employee";

export class EmployeeRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getEmployees(req: Request, res: Response): void {
        const status = res.statusCode;
        Employee.find({}).populate("availabilities", "day time")
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Employee.findById(id).populate("availabilities", "day time")
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

        const employee = new Employee({
            firstName,
            lastName,
            email,
            department,
            position,
            availabilities
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Employee.findByIdAndRemove(id)
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
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Employee.findByIdAndUpdate(id, {$set: req.body}, {new: true})
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
        this.router.get("/", this.getEmployees);
        this.router.get("/:id", this.getEmployee);
        this.router.post("/", this.createEmployee);
        this.router.delete("/:id", this.deleteEmployee);
        this.router.put("/:id", this.updateEmployee);
    }
}
// export
const employeeRoutes = new EmployeeRouter();
employeeRoutes.routes();

export default employeeRoutes.router;
