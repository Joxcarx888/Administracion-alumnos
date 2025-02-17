import User from "./user.model.js"
import Course from "../courses/course.model.js"
import { hash, verify } from 'argon2';

export const listarCursosEstudiante = async (req, res) => {
    try {
        const studentId = req.usuario._id; 

        const student = await User.findById(studentId).populate("enrolledCourses");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        res.json({
            success: true,
            enrolledCourses: student.enrolledCourses
        });
    } catch (error) {
        console.error("Error al obtener los cursos del estudiante:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los cursos"
        });
    }
};

export const editarEstudiante = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { password, role, enrolledCourses, ...data } = req.body; 


        if (password) {
            data.password = await hash(password);
        }


        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado exitosamente",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.usuario; 

        console.log("Intentando desactivar usuario con ID:", _id);

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        const cursos = await Course.find({ _id: { $in: user.enrolledCourses } });

        for (const curso of cursos) {
            curso.students = curso.students.filter(studentId => studentId.toString() !== _id.toString());
            await curso.save();
        }

        console.log("Usuario eliminado de los cursos correctamente.");

        user.enrolledCourses = [];

        user.estado = false;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado y eliminado de los cursos",
            user
        });

    } catch (error) {
        console.error("Error en deleteUser:", error);

        res.status(500).json({
            success: false,
            msg: "Error al desactivar usuario",
            error: error.message || error
        });
    }
};







