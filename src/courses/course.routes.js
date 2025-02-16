import { Router } from "express";
import { check } from "express-validator";
import { getCourses, saveCourse, searchCourse, deleteCourse, updateCourse } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeCursoById } from "../helpers/db-validator.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check('email', 'Este no es un correo válido').not().isEmpty(),
        validarCampos
    ],
    saveCourse
);

router.get("/", getCourses);

router.get(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    searchCourse
);

router.delete(
    "/:id",
    [
        validarJWT, 
        tieneRole("TEACHER_ROLE"), 
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    deleteCourse
);

router.put(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID válido").isMongoId(),
        tieneRole("TEACHER_ROLE"),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    updateCourse
);

export default router;
