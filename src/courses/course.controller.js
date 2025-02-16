import User from '../users/user.model.js';
import Course from './course.model.js';

export const saveCourse = async (req, res) => {
    try {
        const data = req.body;
        const teacher = await User.findOne({ email: data.email });
        const authenticatedUser = req.user;

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Maestro no encontrado'
            });
        }

        const course = new Course({
            ...data,
            teacher: teacher._id
        });

        await course.save();

        res.status(200).json({
            success: true,
            course,
            authenticatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear curso',
            error
        });
    }
};

export const getCourses = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Course.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener cursos',
            error
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
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


export const searchCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id).populate('teacher', 'name');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar curso',
            error
        });
    }
};


export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;
        const authenticatedUser = req.user;

        const course = await Course.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Curso actualizado',
            course,
            authenticatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el curso',
            error
        });
    }
};
