import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [35, "Can't exceed 35 characters"]
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minLength: 8
    },
    role: {
        type: String,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        default: "STUDENT_ROLE"  
    },
    studentInfo: {
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    },
    teacherInfo: {
        coursesCreated: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    },
    estado: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("User", UserSchema);
