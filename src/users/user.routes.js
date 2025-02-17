import { Router } from "express";
import { check , body} from "express-validator";
import { InscribirAlumnos } from "../courses/course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { noDuplicarCurso,noCursosDuplicados } from "../middlewares/validation-mismos-cursos.js";
import { listarCursosEstudiante,editarEstudiante, deleteUser } from "./user.controller.js";



const router = Router();

router.get(
    "/mis-cursos", 
    [
        validarJWT, 
        tieneRole("STUDENT_ROLE"),
        validarCampos
    ], 
    listarCursosEstudiante
);

router.put(
    "/editar", 
    [
        validarJWT, 
        tieneRole("STUDENT_ROLE"),
        validarCampos
    ], 
    editarEstudiante
);

router.put(
    "/inscribirse",
    [
        validarJWT, 
        tieneRole("STUDENT_ROLE"),
        body("enrolledCourses")
            .isArray().withMessage("Los cursos deben estar en un array")
            .custom((courses) => {
                if (courses.length > 3) {
                    throw new Error("Un estudiante solo puede registrarse en un máximo de 3 cursos");
                }
                return true;
            })
            .custom(noCursosDuplicados),
        check("enrolledCourses.*").custom(noDuplicarCurso),
        validarCampos
    ],
    InscribirAlumnos
);

router.delete(
    "/eliminar",
    [
        validarJWT
    ], 
    deleteUser
);


export default router;



