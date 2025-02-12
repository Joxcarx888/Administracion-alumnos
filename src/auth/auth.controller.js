import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/generate-jwt.js';



export const registerStudent = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: "STUDENT_ROLE", 

        });

        return res.status(201).json({
            message: "Student registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Student registration failed",
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

        return res.status(201).json({
            message: "Teacher registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Teacher registration failed",
            error: error.message
        });
    }
};
