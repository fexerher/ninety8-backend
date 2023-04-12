const { Router } = require('express')
const { check } = require('express-validator')
const { validarRol, validarEmail } = require('../helpers/db-validator')



const { carritoGet,  carritoPost, carritoDelete, carritosGet, carritoUpdate , deleteCarritoDetalle} = require('../controllers/carrito')



const router = Router()

router.delete('/detalle/:id', deleteCarritoDetalle )

router.get('/',  carritosGet)

router.get('/:id',  
    carritoGet 
)

router.post('/',  carritoPost )

router.delete('/:id',  carritoDelete)


router.put('/', carritoUpdate)
module.exports = router;