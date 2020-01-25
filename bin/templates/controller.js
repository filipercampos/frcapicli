const pluralize = require('pluralize');
const utils = require('../utils/utils');

/**
 * Template swagger route controller
 */
module.exports = {
    get: function (resource) {
        var resourceUpper = pluralize.singular(utils.toFirstCase(resource));
        var resourceLower = pluralize.singular(utils.toFirstCase(resource, false));

        return `'use strict';
        
const HttpStatusCode = require('../helpers/httpStatusCode');

const CommonController = require('./common.controller');
const ${resourceUpper}Service = require('../../domain/business/${resource}.service');
const CacheMiddleware = require('./cacheMiddleware');

module.exports = class ${resourceUpper}Controller extends CommonController {
    constructor() {
        super(new ${resourceUpper}Service());
    }
    //Specific method
    // async method(req, res) {
    //     try {
    //         //data body
    //         var body = req.body;
            
    //         //realiza a requisica 
    //         let result = await this._service.method(body);
      
    //         super.sendSucess(res, result);
      
    //     } catch (err) {
    //         super.sendError(res, err);
    //     }
    // }

    //Cache request
    // async get(req, res) {
    
    //     const cache = new CacheMiddleware();
    //     cache.buildCache(req, 'header_field', 360);
    
    //     await super.get(req, res, null);
    // }
}


module.exports.get${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.getById(req, res);
}

module.exports.get${resourceLower}s = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.get(req, res);
}

module.exports.post${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.post(req, res);
}

module.exports.put${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.update(req, res);
}

module.exports.remove${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.patch(req, res);
}

module.exports.delete${resourceUpper}ById = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.deleteById(req, res);
}

`;
    }
}




