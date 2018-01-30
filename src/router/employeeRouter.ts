import {Router, Request, Response, NextFunction} from 'express';
import Employee from '../model/employee';

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
       const name: string = req.body.name;    
       const employee = new Employee({
           name
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

