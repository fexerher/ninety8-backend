const { Router } = require('express')
const { check } = require('express-validator')
const { validarRol, validarEmail } = require('../helpers/db-validator')

const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares')


const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuarioGet } = require('../controllers/usuarios')


const router = Router()



router.get('/', usuariosGet )

router.get('/:id' , usuarioGet )

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min:6 }),
    check('rol').custom( validarRol ),
    check('email').custom( validarEmail ),
    validarCampos
], usuariosPost)


router.put('/:id',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rol').custom( validarRol ),
    validarCampos
], usuariosPut )


router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRol('ROL_ADMIN, ROL_USER'),
    validarCampos
], usuariosDelete)



module.exports = router;