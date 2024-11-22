'use strict';

const { Controller } = require('../controllers');


const route = require('express').Router();

route.post('/get-books', Controller.getList);
route.post('/add-book', Controller.addList);
route.post('/edit-book', Controller.editList);
route.post('/remove-book', Controller.removeList);


module.exports = route;