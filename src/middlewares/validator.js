import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const studentRegisterValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("email", "Debe ingresar un correo válido").not().isEmpty().isEmail(),
    body("email").custom(existenteEmail),
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),

    body("role").custom((value, { req }) => {
        if (value && value !== "STUDENT_ROLE") {
            throw new Error("Los estudiantes solo pueden registrarse con el rol STUDENT_ROLE");
        }
        return true;
    }),

    body("studentInfo.courses").optional().isArray().withMessage("Los cursos deben estar en un array"),
    validarCampos
];

export const teacherRegisterValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("email", "Debe ingresar un correo válido").not().isEmpty().isEmail(),
    body("email").custom(existenteEmail), 
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),

    body("role").custom((value, { req }) => {
        if (value !== "TEACHER_ROLE") {
            throw new Error("Los profesores deben registrarse con el rol TEACHER_ROLE");
        }
        return true;
    }),

    body("teacherInfo.coursesCreated").optional().isArray().withMessage("Los cursos deben estar en un array"),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un correo válido"),
    body("username").optional().isString().withMessage("Ingrese un nombre de usuario válido"),
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),

    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.username) {
            throw new Error("Debe proporcionar un correo electrónico o un nombre de usuario");
        }
        return true;
    }),
    
    validarCampos
];
