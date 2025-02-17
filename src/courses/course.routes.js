import { Router } from "express";
import { check , body} from "express-validator";
import { listarCursosProfesor, saveCourse, deleteCourse, editarCurso, InscribirAlumnos } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeCursoById } from "../helpers/db-validator.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { noDuplicarCurso,noCursosDuplicados } from "../middlewares/validation-mismos-cursos.js";



const router = Router();

router.post(
    "/",
    [
        validarJWT, 
        tieneRole("TEACHER_ROLE"),
        validarCampos
    ],
    saveCourse
);


router.get("/",
     [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
      ],
      listarCursosProfesor
);



router.delete(
    "/:id",
    [
        validarJWT, 
        tieneRole("TEACHER_ROLE"), 
        check("id").custom(existeCursoById),
        validarCampos
    ],
    deleteCourse
);

router.put(
    "/:id",
    [
        validarJWT, 
        tieneRole("TEACHER_ROLE"),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    editarCurso
);

export default router;
