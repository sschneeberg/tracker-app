const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/:month', isLoggedIn, (req, res) => {
    res.render('userHome');
});

module.exports = router