export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un rol sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({
                success: false,
                msg: `Acceso denegado. Este recurso requiere uno de los siguientes roles: ${roles.join(', ')}`
            });
        }
        

        next();
    }

    
}