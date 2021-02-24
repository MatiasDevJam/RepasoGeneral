
const {check} = require('express-validator');

module.exports = [
    

    check('email')
    .isEmail().withMessage('Debe ser un email valido'),

    check('pass')
    .notEmpty().withMessage('La contraseña es requerida'),

   
]