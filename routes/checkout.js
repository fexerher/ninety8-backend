const { Router } = require('express');

const { checkoutPost } = require('../controllers/checkout');

const router = Router()



router.post('/', checkoutPost )



module.exports = router;