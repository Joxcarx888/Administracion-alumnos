import User from "../users/user.model.js";


export const noDuplicarCurso = async (courseId, { req }) => {
    try {
        const userId = req.usuario._id;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user.studentInfo.courses.includes(courseId)) {
            throw new Error("Ya estás inscrito en este curso.");
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const noCursosDuplicados = (courses) => {
    if (!Array.isArray(courses)) {
        throw new Error("Los cursos deben ser un array");
    }

    const uniqueCourses = new Set(courses);
    if (uniqueCourses.size !== courses.length) {
        throw new Error("No puedes registrar dos veces el mismo curso");
    }

    return true;
};

