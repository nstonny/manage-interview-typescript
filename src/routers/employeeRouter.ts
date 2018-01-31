import {Router, Request, Response, NextFunction} from 'express';
import Employee from '../models/employee';

export class EmployeeRouter{
    router: Router;

    constructor(){
        this.router = Router();  
        this.routes();      
    }
   public getEmployees(req:Request, res:Response):void{
       
       const status = res.statusCode;
       Employee.find({})
       .then(data => {
           res.json({
               status,
               data
           });
       })
       .catch(err => {
           const status = res.statusCode;
           res.json({
               status,
               err
           });
       });   
        
   }
   public createEmployee(req:Request, res:Response): void{       
       const firstName: String = req.body.firstName;
       const lastName: String = req.body.lastName;  
       const email: String = req.body.email; 
       const department: String = req.body.department;
       const position: String = req.body.position;

       const employee = new Employee({           
           firstName,
           lastName,
           email,
           department,
           position                    
       });       
       employee.save()
       .then(data => {
           const status = res.statusCode;
           res.json({
               status,
               data
           });
       })
       .catch(err => {
           const status = res.statusCode;
           res.json({
               status,
               err
           });
       });        
   }
   routes(){
       this.router.get('/', this.getEmployees);
       this.router.post('/', this.createEmployee)
   }
}
//export
const employeeRoutes = new EmployeeRouter();
employeeRoutes.routes();

export default employeeRoutes.router;

