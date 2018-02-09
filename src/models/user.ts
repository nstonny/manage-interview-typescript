import * as jwt from "jsonwebtoken";
import { Document, Model, model, Schema } from "mongoose";
import * as validator from "validator";
import { IPerson } from "../interfaces/person";

export interface IUserDocument extends IPerson, Document {
    username: string;
    password: string;
    generateAuthToken(): Promise<any>;
}
export interface IUserModel extends Model<IUserDocument> {
    findByToken(token): Promise<any>;
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

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return { id: userObject._id, email: userObject.email };
};
UserSchema.methods.generateAuthToken = async function () {
    let user = this;
    const access = "auth";
    const token = jwt.sign({ _id: user._id.toHexString(), access }, "abc123").toString();
    user.tokens.push({ access, token });
    // see if a new Promise can be returned
    return user.save()
        .then(() => {
            return token;
        });
};
UserSchema.statics.findByToken = async function(token) {
    let User = this;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "abc123");
    } catch (e) {
        return Promise.reject("unauthorized");
    }
    return User.findOne({
        "_id": decodedToken._id,
        "tokens.access": "auth",
        "tokens.token": token
    });
}

/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */

export const User: IUserModel = model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
