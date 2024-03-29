//This layer was removed from route
const pluralize = require('pluralize');
const utils = require('../utils/utils');
/**
 * Template repository
 */
module.exports = {
  get: function (resource) {
    let resourceUpper = utils.toResourceName(resource);
    let resourceLower = pluralize.singular(utils.toFirstCase(resource, false));
    return `'use strict';
const BaseRepository = require('./base.repository');
const ${resourceUpper}Model = require('../models/${resourceLower}.model');

module.exports = class ${resourceUpper}Repository extends BaseRepository {
    constructor() {
      super(${resourceUpper}Model);
    }

    /**
     * Custom request for ${resource}
     * 
     */
     async find${resourceUpper}By(criteria) {
      try {
        return await super.findOne({ criteria });
      } catch (error) {
        this.handleError(error);
      }
    }
  }
`;
  },
};
