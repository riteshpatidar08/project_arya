const express = require('express');

const router  = express.Router() ;
console.log(require('../controllers/user.controller.js'))
const {register , login} = require('../controllers/user.controller.js')

router.post('/register' ,  register ) ;
router.post('/logn' , login) ;
module.exports = router ;


// http://localhost:3000/api/v1/register  , {}
// $2a$12$hQ17BLI8XseEOeHwc43fP.zy7xFoIA7B44nT1vYiBr9IGzx6QDn1.