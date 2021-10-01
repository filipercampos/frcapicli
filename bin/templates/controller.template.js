const pluralize = require('pluralize');
const utils = require('../utils/utils');

/**
 * Template controller
 */
module.exports = {
  get: function (resource) {
    let resourceUpper = pluralize.singular(utils.toFirstCase(resource));
    // let resourceLower = pluralize.singular(utils.toFirstCase(resource, false));

    return `'use strict';
const BaseController = require('./base.controller');
const { ${resourceUpper}Repository } = require('../domain/repositories');
const { RequestHelper } = require('../common/helpers');
const { BadRequestException } = require('../common/exceptions');

class ${resourceUpper}Controller extends BaseController {
  constructor() {
    super(new ${resourceUpper}Repository());
  }

  /**
  * Custom Request GET
  */
  async customRequest(req, res) {
    try {
      //validate required query 
      //SwaggerHelper.validateQuery(req, ['name', 'lastname']);
      //validate required body
      // SwaggerHelper.validateBody(req, ['name', 'lastname']);
      const result = await this._repository.find(req.query);
      super.sendSuccess(res, result);
    } catch (err) {
      super.sendError(res, err);
    }
  }
}
module.exports = new ${resourceUpper}Controller();
`;
  }
}




