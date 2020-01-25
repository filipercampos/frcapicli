const Utils = require('../utils/utils');
const pluralize = require('pluralize');

/**
 * Template data model response
 */
module.exports = {
    model: function (resource) {

        return `'use strict';
        const utils = require('../utils');
// Objeto de response da api ${pluralize.plural(Utils.toFirstCase(resource))}
module.exports = {
    dto: (entity) => {
        return {
            //set properties
        }
    }
};`;
    }
}




