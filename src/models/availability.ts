import { model, Schema } from "mongoose";

const AvailabilitySchema: Schema = new Schema({
    createdAt: {
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
    }
});
export default model("Availability", AvailabilitySchema);
