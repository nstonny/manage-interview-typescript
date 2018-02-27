import { model, Schema } from "mongoose";

const AvailabilitySchema: Schema = new Schema({
    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    updatedAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    day: {
        required: true,
        trim: true,
        type: String
    },
    time: {
        required: true,
        trim: true,
        type: String
    },
    _creator: {
        required: true,
        type: Schema.Types.ObjectId
    }
});
AvailabilitySchema.pre("findOneAndUpdate", function() {
    this.update({}, { $set: { updatedAt: new Date() } });
  });
export default model("Availability", AvailabilitySchema);
