


const validarCampos  = require('../middlewares/validar-campos')
const validarJWT  = require('../middlewares/validar-token')
const validaRoles = require('../middlewares/validar-roles')
const addSessionId = require('../middlewares/cookie-session')
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...addSessionId,
}