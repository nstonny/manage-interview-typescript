import { Document, model, Schema } from "mongoose";
import * as validator from "validator";
import { IPerson } from "../interfaces/person";

export interface IUser extends IPerson, Document {
    username: string;
    password: string;
}
const UserSchema: Schema = new Schema({
    createdAt: {
        default: Date.now,
        required: true,
        type: Date
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
    password: {
        minlength: 6,
        required: true,
        type: String
    },
    tokens: [{
        access: {
            required: true,
            type: String
        },
        token: {
            required: true,
            type: String
        }
    }]
});
/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */
export default model<IUser>("User", UserSchema);
