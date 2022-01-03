//This layer was removed from route
const utils = require('../utils/utils');
/**
 * Template service
 */
module.exports = {
  get: function (resource) {
    const resourceUpper = utils.toFirstCase(utils.removeHyphen(resource));

    // let resourceLower = pluralize.singular(utils.toFirstCase(resource, false));
    return `'use strict';

const BaseService = require('../base-api.service');
const ParameterUtil = require('../../app/common/utils/parameter');

module.exports = class ${resourceUpper}Service extends BaseService {

    constructor() {
        super();
    }

    /**
     * Get by ID
     */
    async getById(id) {
        const pUtil = new ParameterUtil('endpoint');
        pUtil.pushPath(id);
        const url = pUtil.toUrl();
        let result = await this.getAxiosResult(url);
        return result;
    }

    /**
     * Get with find
     */
    async find(params) {
        const pUtil = new ParameterUtil('endpoint');
        pUtil.pushParam('paramName', params.paramName);
        const url = pUtil.toUrl();
        let results = await this.getAxiosResult(url);
        return results;
    }

    /**
     * Post data
     */
    async post(body) {
        const result = await this.postAxiosResult('endpoint', body);
        return result;
    }

    /**
     * Put data
     */
    async put(id, body) {
        const result = await this.putAxiosResult('endpoint', id, body);
        return result;
    }

    /**
     * Patch
     */
    async patch(id, body) {
        const result = await this.patchAxiosResult('endpoint', id, body);
        return result;
    }

    /**
     * Delete
     */
    async delete(id, body) {
        const result = await this.deleteAxiosResult('endpoint', id, body);
        return result;
    }

}
`;
  },
};
