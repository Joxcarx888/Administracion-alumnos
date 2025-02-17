import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [35, "Can't exceed 35 characters"],
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
      default: "STUDENT_ROLE",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCourses: [ 
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        validate: [
          {
            validator: function (val) {
              return val.length <= 3; 
            },
            message: "Un estudiante solo puede estar inscrito en un máximo de 3 cursos",
          },
        ],
      },
    ],
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

export default model("User", UserSchema);
