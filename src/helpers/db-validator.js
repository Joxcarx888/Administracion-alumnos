import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Course from '../courses/course.model.js';


export const esRoleValido = async (role = '') => {
    const rolesPermitidos = ["TEACHER_ROLE", "STUDENT_ROLE"];
    if (!rolesPermitidos.includes(role)) {
        throw new Error(`El rol ${role} no es válido`);
    }
};


export const existenteEmail = async (email = '') =>{
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeCursoById = async (id = '') => {
    const existeCurso = await Course.findById(id);

    if (!existeCurso) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
};
