const jwt = require('jsonwebtoken');

//======================================
// Verificar token
//======================================

let verifiedToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

//======================================
// Verificar ADMIN_ROLE
//======================================
let verifiedAdminRol = (req, res, next) => {
    if (req.user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tiene permisos de administrador'
            }
        });
    }
};

module.exports = {
    verifiedToken,
    verifiedAdminRol
}