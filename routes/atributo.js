const { Router } = require('express');

const {  atributoDelete , atributoPost, atributosPut, atributosGet } = require('../controllers/atributo');

const router = Router()



router.get('/', atributosGet)
router.post('/', atributoPost)
router.delete('/:id', atributoDelete)
router.put('/',  atributosPut)



module.exports = router;