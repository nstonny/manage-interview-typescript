import { Document, model, Model, Schema } from "mongoose";
import * as validator from "validator";
import { IPerson } from "../interfaces/person";

export interface IEmployee extends IPerson, Document {
    department: string;
    position: string;
}

const EmployeeSchema: Schema = new Schema({
    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    department: {
        default: "",
        trim: true,
        type: String
    },
    email: {
        default: "",
        lowercase: true,
        minlength: 1,
        required: true,
        trim: true,
        type: String,
        unique: true,
        validate: {
            message: "{VALUE} is not a valid email",
            validator: validator.isEmail
        }
    },
    firstName: {
        default: "",
        required: true,
        trim: true,
        type: String
    },
    lastName: {
        default: "",
        required: true,
        trim: true,
        type: String
    },
    position: {
        default: "",
        trim: true,
        type: String
    },
    availabilities: [{
        ref: "Availability",
        type: Schema.Types.ObjectId
    }],
    _creator: {
        required: true,
        type: Schema.Types.ObjectId
    },
});
/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */
export const Employee: Model<IEmployee> = model<IEmployee>("Employee", EmployeeSchema);
export default Employee;
