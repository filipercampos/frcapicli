const pluralize = require('pluralize');
const utils = require('../utils/utils');

/**
 * Template swagger route controller
 */
module.exports = {
    get: function (resource) {
        var resourceUpper = pluralize.singular(utils.toFirstCase(resource));

        return `'use strict';
        
const HttpStatusCode = require('../helpers/httpStatusCode');

const CommonController = require('./common.controller');
const ${resourceUpper}Service = require('../../domain/services/${resource}.service');
const CacheMiddleware = require('./cacheMiddleware');

module.exports = class ${resourceUpper}Controller extends CommonController {
    constructor() {
        super();
        this._service = new ${resourceUpper}Service();
    }
    //Specific method
    // async method(req, res) {
    //     try {
    //         //params body
    //         let body = req.body;
    //         //params in query          
    //         let params = req.swagger.params;
    //         //params in path
    //         let params = req.swagger.params.id.value;
    //         //call request 
    //         let result = await this._service.method(body);
    //         //send success
    //         super.sendSuccess(res, result);
    //     } catch (err) {
    //         //send error
    //         super.sendError(res, err);
    //     }
    //}

    //Cache request
    // async get(req, res) {
    //     const cache = new CacheMiddleware();
    //     cache.buildCache(req, 'header_field', 360);
    //     await super.get(req, res, null);
    // }
}


module.exports.get${resourceUpper} = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.getById(req, res);
}

module.exports.get${resourceUpper}s = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.get(req, res);
}

module.exports.post${resourceUpper} = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.post(req, res);
}

module.exports.put${resourceUpper} = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.put(req, res);
}

module.exports.patch${resourceUpper} = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.patch(req, res);
}

module.exports.delete${resourceUpper}ById = function (req, res) {
    const controller = new ${resourceUpper}Controller();
    controller.deleteById(req, res);
}

`;
    }
}




