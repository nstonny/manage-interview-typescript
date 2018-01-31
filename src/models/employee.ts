//TODO
//properties: name
//add dependency of availabilities

import { Schema, Document, model} from 'mongoose';
import {IPerson} from '../interfaces/person';

export interface IEmployee extends IPerson, Document{
    department: String;
    position: String;
}

let EmployeeSchema: Schema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    firstName:{
    type: String,
    trim: true,
    default: '',
    required: true
    },
    lastName:{
        type: String,
        trim: true,
        default: '',
        required: true
    },
    email: { 
        type: String,
        trim: true,
        lowercase: true,
        default: '',
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    department:{
        type: String,
        trim:true,
        default: ''
    },
    position:{
        type: String,
        trim: true,
        default: ''
    }
});

export default model<IEmployee>('Employee', EmployeeSchema);

