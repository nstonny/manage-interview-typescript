import { Document, model, Model, Schema } from "mongoose";
import * as validator from "validator";
import { IPerson } from "../interfaces/person";

export interface ICandidate extends IPerson, Document {
    positionAppliedFor: string;
    employees: string[];
}

const CandidateSchema: Schema = new Schema({
    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    employees: [{
        ref: "Employee",
        type: Schema.Types.ObjectId
    }],
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
    positionAppliedFor: {
        default: "",
        trim: true,
        type: String
    },
    _creator: {
        required: true,
        type: Schema.Types.ObjectId
    }
});
/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */
export const Candidate: Model<ICandidate> = model<ICandidate>("Candidate", CandidateSchema);
export default Candidate;
