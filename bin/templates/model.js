const Utils = require('../utils/utils');
const pluralize = require('pluralize');

/**
 * Template data model response
 */
module.exports = {
    get: function (resource) {

        return `'use strict';
const utils = require('../utils');
// Objeto de response da api ${pluralize.plural(Utils.toFirstCase(resource))}
module.exports = {
    model: (entity) => {
        return {
            //set properties
        }
    }
};`;
    }
}




