import { NextFunction, Request, Response, Router } from "express";
import { ObjectID } from "mongodb";
import Employee from "../models/employee";

export class EmployeeRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public getAll(req: Request, res: Response): void {

        const status = res.statusCode;
        Employee.find({})
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
    public getOne(req: Request, res: Response): void {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            console.log("invalid objectid");
            res.status(404).json({
                status: res.statusCode,
                message: "invalid ObjectID"
            });
        }
        Employee.findById(id)
            .then((data) => {
                if (!data) {
                    return res.status(404).json({
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
    public createOne(req: Request, res: Response): void {
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const email: string = req.body.email;
        const department: string = req.body.department;
        const position: string = req.body.position;

        const employee = new Employee({
            firstName,
            lastName,
            email,
            department,
            position
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
    public routes() {
        this.router.get("/", this.getAll);
        this.router.get("/:id", this.getOne);
        this.router.post("/", this.createOne);
    }
}
// export
const employeeRoutes = new EmployeeRouter();
employeeRoutes.routes();

export default employeeRoutes.router;
