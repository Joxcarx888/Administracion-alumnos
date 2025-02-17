import Usuario from '../users/user.model.js';
import Course from '../courses/course.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';


export const registerStudent = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const encryptedPassword = await hash(password);

        const user = new Usuario({
            name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "STUDENT_ROLE",
        });

        await user.save();

        return res.status(201).json({
            message: "Estudiante registrado con éxito",
            userDetails: {
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al registrar el estudiante",
            error: error.message,
        });
    }
};




export const registerTeacher = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const encryptedPassword = await hash(password);

        const user = await Usuario.create({
            name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "TEACHER_ROLE",
        });

        return res.status(201).json({
            message: "Profesor registrado con éxito",
            userDetails: { email: user.email }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al registrar el profesor",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await Usuario.findOne({
            $or: [{ email: email?.toLowerCase() }, { username }]
        });

        if (!user || !user.estado) {
            return res.status(400).json({ msg: 'Credenciales incorrectas o usuario inactivo' });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const token = await generarJWT(user.id, user.role);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            userDetails: {
                username: user.username,
                role: user.role,
                token
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Error en el servidor",
            error: e.message
        });
    }
};