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
        
const Response = require('../helpers/httpResponse');
const HttpStatusCode = require('../helpers/httpStatusCode');
const HttpException = require('../exception/httpError.exception');

const CommonService = require('./common.service');
const ${resourceUpper}BO = require('../../domain/business/${resource}.bo');

module.exports = class ${resourceUpper}Service extends CommonService {
    constructor() {
        super(new ${resourceUpper}BO());
    }
    //Specific method
    async method(req, res) {
        try {
    
            var body = req.swagger.param;
            let params = req.swagger.params;
    
            //TODO GET OR POST
            //let result = await this._business.post(body);
            //let result = await this._business.get(param);

            res.status(HttpStatusCode.OK).send(result);
    
        } catch (err) {
            if (err instanceof HttpException) {
            Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message);
            }
            else {
            Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }
}


module.exports.get${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.findById(req, res);
}

module.exports.get${resourceLower} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.find(req, res);
}

module.exports.post${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.save(req, res);
}

module.exports.put${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.update(req, res);
}

module.exports.remove${resourceUpper} = function (req, res) {
    const service = new ${resourceUpper}Service();
    service.remove(req, res);
}`;
    }
}




