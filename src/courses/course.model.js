import { Schema, model } from "mongoose";

const CourseSchema = new Schema(
    {
      title: {
        type: String,
        required: [true, "Título es requerido"],
        maxLength: [100, "No más de 100 caracteres"],
        minLength: [5, "Mínimo 5 caracteres"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Descripción es requerida"],
        maxLength: [500, "No más de 500 caracteres"],
        minLength: [10, "Mínimo 10 caracteres"],
        trim: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
      teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Maestro requerido"],
      },
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  // Evitar duplicados en students antes de guardar
  CourseSchema.pre("save", function (next) {
    this.students = [...new Set(this.students.map((s) => s.toString()))];
    next();
  });
  
  export default model("Course", CourseSchema);
  
