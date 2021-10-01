const pluralize = require('pluralize');

/**
 * Template controller
 */
module.exports = {
    get: function (resource) {
        let resourcePlural = pluralize.plural(resource.toLowerCase());
        let resourceLower = pluralize.plural(resource.toLowerCase());

        return `'use strict';
const router = require('express').Router();
const controller = require('../controllers/${resourceLower}.controller');
/*
* Be careful 
* If don't use module.export.post, don't do it this:
* router.post('/', controller.post); ///wrong
* router.get('/', (req, res) => controller.find(req, res)); //rigth
*/

//get
router.get('/${resourcePlural}', (req, res) => controller.find(req, res));
//get by id
router.get('/${resourcePlural}/:id', (req, res) => controller.findById(req, res));
//post
router.post('/${resourcePlural}', (req, res) => controller.post(req, res));
//put
router.put('/${resourcePlural}/:id', (req, res) => controller.put(req, res));
//put
router.patch('/${resourcePlural}/:id', (req, res) => controller.patch(req, res));
//delete
router.delete('/${resourcePlural}/:id', (req, res) => controller.deleteOne(req, res));

module.exports = app => app.use('/api/v1', router);

`;
    }
}




