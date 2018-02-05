// TODO
// add dependency of availabilities

import { Document, model, Schema } from "mongoose";
import { IPerson } from "../interfaces/person";

export interface ICandidate extends IPerson, Document {
    positionAppliedFor: string;
    interviewers: string[];
}

const CandidateSchema: Schema = new Schema({
    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    interviewers: [{
        ref: "Employee",
        type: Schema.Types.ObjectId
    }],
    email: {
        default: "",
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        required: true,
        trim: true,
        type: String,
        unique: true
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
    }
});
/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */
export default model<ICandidate>("Candidate", CandidateSchema);
