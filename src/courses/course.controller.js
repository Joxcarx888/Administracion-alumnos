import Course from './course.model.js';

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
        
        const course = await Course.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Curso eliminado exitosamente",
            course
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
        const { courses } = req.body; 
        const authenticatedUser = req.usuario; 

        if (authenticatedUser.role !== "STUDENT_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Esta función solo es para estudiantes"
            });
        }

        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debes proporcionar un arreglo de IDs de cursos"
            });
        }

        const updatedCourses = await Promise.all(
            courses.map(async (courseId) => {
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



