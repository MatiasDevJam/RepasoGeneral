var express = require('express');
var router = express.Router();

const {login, processLogin, register, processRegister, profile, logout, del} = require('../controllers/userControllers')

// Middlewares
const uploadImages = require('../middlewares/uploadImages');
const registerValidator = require('../validations/registerValidator')
const checkUsers = require('../middlewares/checkUsers');


router.get('/register', register);
router.post('/register', uploadImages.any(), registerValidator, processRegister);

router.get('/login', login);
router.post('/login', processLogin);

router.get('/profile', checkUsers, profile)

router.get('/logout', logout)

router.delete('/delete/:id', del)

module.exports = router;
