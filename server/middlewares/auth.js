const jwt = require('jsonwebtoken');

//MiddleWare Verificar Token

let verificaToken = (req, res, next) => { //el next sirve para continuar la ejecucion

    let token = req.get('token'); //obtengo el header token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es correcto'
                }
            });
        }
        req.usuario = decoded.usuario; //yo se que el objeto que encripte esta el usuario por eso lo pongo asi, el decoded es el payload
        console.log(req.usuario);
        console.log(decoded);
        next();
    });


}

//MiddleWare AdminRole

let verificaAdminRole = (req, res, next) => {

        let usuario = req.usuario;

        if (usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            res.json({
                ok: false,
                err: {
                    message: 'Necesitas permisos de administrador'
                }
            });
        }

    }
    //Middleware verficicar token para imagen

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es correcto'
                }
            });
        }
        req.usuario = decoded.usuario; //yo se que el objeto que encripte esta el usuario por eso lo pongo asi, el decoded es el payload
        console.log(req.usuario);
        console.log(decoded);
        next();
    });


}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}