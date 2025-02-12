import Usuario from '../users/user.model.js';
import Course from '../courses/course.model.js';  
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';


export const registerStudent = async (req, res) => {
    try {
        const data = req.body;
        if (data.courses && data.courses.length > 3) {
            return res.status(400).json({
                message: "Solo puedes entrar a 3 cursoss"
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: "STUDENT_ROLE", 
        });

        if (data.courses && data.courses.length > 0) {
            const existingCourses = await Usuario.findOne({ _id: user._id }, 'studentInfo.courses');
            
            const newCourses = data.courses.filter(course => 
                !existingCourses.studentInfo.courses.includes(course)
            );

            if (newCourses.length !== data.courses.length) {
                return res.status(400).json({
                    message: "Ya estas en estos cursos"
                });
            }

            const student = await Usuario.findByIdAndUpdate(
                user._id,
                { $push: { "studentInfo.courses": { $each: newCourses } } },
                { new: true }
            );
        }

        return res.status(201).json({
            message: "Estudiante registrado con exito",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Estudiante no registrado",
            error: error.message
        });
    }
};


export const registerTeacher = async (req, res) => {
    try {
        const data = req.body;

        if (!data.role || data.role !== "TEACHER_ROLE") {
            return res.status(400).json({ message: "Role must be TEACHER_ROLE" });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role, 
        });

        if (data.course) {
            const course = await Course.create({
                title: data.course.title,
                description: data.course.description,
                teacher: user._id, 
            });

            await Usuario.findByIdAndUpdate(user._id, {
                $push: { "teacherInfo.coursesCreated": course._id }
            });
        }

        return res.status(201).json({
            message: "Profesor ha sido agregado con extio",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Fallo el registro del profesor",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
};
