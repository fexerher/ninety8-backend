const { Router } = require('express')
const { check } = require('express-validator')
const { validarRol, validarEmail } = require('../helpers/db-validator')
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares')


const { productosGet, productosPut, productosPost, productosDelete, getProductoById } = require('../controllers/productos')


const router = Router()



router.get('/', productosGet )

router.get('/:slugifiedName' , getProductoById )


router.post('/',  productosPost)


router.put('/:id',[
    validarCampos
], productosPut )


router.delete('/:id', productosDelete)



module.exports = router;