import { Schema, model} from 'mongoose';

//properties: name
//add dependency of availabilities

let EmployeeSchema: Schema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    name:{
        type: String,
        default: '',
        required: true
    }    
})
export default model('Employee', EmployeeSchema);