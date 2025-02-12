import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title can't exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [500, "Description can't exceed 500 characters"]
    },
    status:{
        type: Boolean,
        default: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Teacher is required"]
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});



export default model("Course", CourseSchema);
