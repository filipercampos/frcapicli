//This layer was removed from route
const pluralize = require('pluralize');
const utils = require('../utils/utils');
/**
 * Template repository
 */
module.exports = {
  get: function (resource) {

    let resourceUpper = utils.toFirstCase(resource);
    let resourceLower = pluralize.singular(utils.toFirstCase(resource, false));
    return `'use strict';
const BaseRepository = require('./base.repository');
const ${resourceUpper}Model = require('../models/${resourceLower}.model');


module.exports = class ${resourceUpper}Repository extends BaseRepository {
    constructor() {
      super();
    }

    /**
     * Custom request for ${resource}
     * 
     */
     async findUserByEmail(email) {
      try {
        return await super.findOne({ email });
      } catch (error) {
        this.handleError(error);
      }
    }
  }
`;
  }
}



