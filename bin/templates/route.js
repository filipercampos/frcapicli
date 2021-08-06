const pluralize = require('pluralize');

/**
 * Template controller
 */
module.exports = {
    get: function (resource) {
        let resourceLower = pluralize.singular(resource.toLowerCase());

        return `'use strict';
const router = require('express').Router();
const controller = require('../routes/${resourceLower}.controller');
/*
* Be careful 
* If don't use module.export.post, don't do it this:
* router.post('/', controller.post); ///wrong
* router.get('/', (req, res) => controller.find(req, res)); //rigth
*/

//get
router.get('/', (req, res) => controller.find(req, res));
//post
router.post('/', (req, res) => controller.post(req, res));
//put
router.put('/:id', (req, res) => controller.put(req, res));
//put
router.patch('/:id', (req, res) => controller.put(req, res));
//delete
router.delete('/:id', (req, res) => controller.deleteOne(req, res));

module.exports = app => app.use('/api/v1/${resourceLower}s', router);

`;
    }
}




