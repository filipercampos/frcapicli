//This layer was removed from route
const utils = require('../utils');
/**
 * Template service
 */
module.exports = { 
    get: function(resource) {
        
        let resourceUpper = utils.toFirstCase(resource);
        
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
    async resquestCutom(req, res) {
        try {
    
          var auth = body.auth;
    
          let result = await this._business.method(body);

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
}`;
    }
}




