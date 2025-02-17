import Course from './course.model.js';
import User from "../users/user.model.js";


export const saveCourse = async (req, res) => {
    try {
        const data = req.body;
        const authenticatedUser = req.usuario; 

        if (!authenticatedUser || authenticatedUser.role !== "TEACHER_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para crear un curso"
            });
        }

        const course = new Course({
            ...data,
            teacher: authenticatedUser._id
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: "Curso creado exitosamente",
            course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al crear curso",
            error
        });
    }
};


export const listarCursosProfesor = async (req, res) => {
    try {
        const teacherId = req.usuario._id; 

        const cursos = await Course.find({ teacher: teacherId });

        res.json({
            success: true,
            cursos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener los cursos",
        });
    }
};


export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.usuario._id; 

        const curso = await Course.findOne({ _id: id, teacher: teacherId });

        if (!curso) {
            return res.status(403).json({
                success: false,
                msg: "No puedes eliminar este curso",
            });
        }

        const students = await User.find({ enrolledCourses: id });

        
        for (const student of students) {
            let newEnrolledCourses = [];
            for (let i = 0; i < student.enrolledCourses.length; i++) {
                if (student.enrolledCourses[i].toString() !== id) {
                    newEnrolledCourses[newEnrolledCourses.length] = student.enrolledCourses[i]; 
                }
            }
            
            await User.updateOne(
                { _id: student._id },
                { enrolledCourses: newEnrolledCourses },
                { runValidators: false } 
            );
        }

        
        curso.students = [];
        curso.status = false; 
        await curso.save();

        res.status(200).json({
            success: true,
            message: "Curso eliminado exitosamente y estudiantes desinscritos",
            course: curso
        });

    } catch (error) {
        console.error("Error al eliminar curso:", error); 
        res.status(500).json({
            success: false,
            message: "Error al eliminar curso",
            error: error.message 
        });
    }
};





export const editarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.usuario._id; 

        const curso = await Course.findOne({ _id: id, teacher: teacherId });

        if (!curso) {
            return res.status(403).json({
                success: false,
                msg: "No puedes editar este curso",
            });
        }


        const cursoActualizado = await Course.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            success: true,
            msg: "Curso actualizado exitosamente",
            curso: cursoActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el curso",
        });
    }
};

export const InscribirAlumnos = async (req, res) => {
    try {
        const { enrolledCourses } = req.body;
        const authenticatedUser = req.usuario; 

        if (authenticatedUser.role !== "STUDENT_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Esta función solo es para estudiantes"
            });
        }

        if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debes proporcionar un arreglo de IDs de cursos"
            });
        }

        const user = await User.findById(authenticatedUser._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const totalCursos = user.enrolledCourses.length + enrolledCourses.length;
        if (totalCursos > 3) {
            return res.status(400).json({
                success: false,
                message: "Un estudiante solo puede estar inscrito en un máximo de 3 cursos",
            });
        }


        const updatedCourses = await Promise.all(
            enrolledCourses.map(async (courseId) => { 
                const curso = await Course.findById(courseId);

                if (!curso) return null;

                if (!curso.students.includes(authenticatedUser._id)) {
                    return Course.findByIdAndUpdate(
                        courseId,
                        { students: [...curso.students, authenticatedUser._id] },
                        { new: true }
                    );
                }

                return curso;
            })
        );

        await User.findByIdAndUpdate(authenticatedUser._id, {
            enrolledCourses: [...user.enrolledCourses, ...enrolledCourses]
        });

        return res.status(200).json({
            success: true,
            msg: "Te has inscrito en los cursos seleccionados",
            courses: updatedCourses.filter(course => course !== null) 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al inscribirte en los cursos",
            error
        });
    }
};





