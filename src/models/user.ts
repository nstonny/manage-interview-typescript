import * as jwt from "jsonwebtoken";
import { Document, Model, model, Schema } from "mongoose";
import * as validator from "validator";
import { IPerson } from "../interfaces/person";
import * as bcrypt from "bcryptjs";
import { resolve } from "dns";

export interface IUserDocument extends IPerson, Document {
    username: string;
    password: string;
    generateAuthToken(): Promise<any>;
}
export interface IUserModel extends Model<IUserDocument> {
    findByToken(token): Promise<any>;
    findByCredentials(email, password): Promise<any>;
}
const UserSchema: Schema = new Schema ({
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
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    return { id: userObject._id, email: userObject.email };
};
UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    try {
        const access = "auth";
        const token = await jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
        if (!token) {
            return Promise.reject("could not generate auth token");
        }
        user.tokens.push({ access, token });
        return new Promise(async (resolve) => {
            await user.save();
            resolve(token);
        });
    } catch (err) {
        return Promise.reject(err);
    }
};
UserSchema.methods.removeToken = async function(token) {
    const user = this;
    try {
        return new Promise(async (resolve) => {
            await user.update({
                $pull: {
                    tokens: { token }
                }
            });
            resolve();
        });
    } catch (err) {
        return Promise.reject("token can not be removed");
    }
};
UserSchema.statics.findByToken = async function(token) {
    const User = this;
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return Promise.reject("unauthorized");
        }
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({
                "_id": decodedToken._id,
                "tokens.access": "auth",
                "tokens.token": token
            });
            user ? resolve(user) : reject("no user found");
        });
    } catch (err) {
        return Promise.reject("unauthorized");
    }
};
UserSchema.statics.findByCredentials = async function(email, password) {
    const User = this;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return Promise.reject("no user found with that email");
        }
        return new Promise(async (resolve, reject) => {
            const res = await bcrypt.compare(password, user.password);
            res ? resolve(user) : reject("incorrect password");
        });
    } catch (err) {
        return Promise.reject(err);
    }

};
UserSchema.pre("save", async function(next) {
    var user = this;
    try {
        if (user.isModified("password")) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            next();
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});
/*
// fix this for put request using findOneAndUpdate
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
  });
  */

export const User: IUserModel = model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
