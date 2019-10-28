const pluralize = require('pluralize');
const utils = require('../utils');

/**
 * Template swagger route controller
 */
module.exports = {
    get: function (resource) {
        var resourceUpper = pluralize.singular(utils.toFirstCase(resource));
        var resourceLower = pluralize.singular(utils.toFirstCase(resource, false));

        return `'use strict';
const ${resourceUpper}Service = require('../services/${resourceLower}.service');
const service = new ${resourceUpper}Service();

module.exports.get${resourceUpper} = function (req, res) {
    service.findById(req, res);
}

module.exports.get${resourceLower} = function (req, res) {
    service.find(req, res);
}

module.exports.post${resourceUpper} = function (req, res) {
    service.save(req, res);
}

module.exports.put${resourceUpper} = function (req, res) {
    service.update(req, res);
}

module.exports.remove${resourceUpper} = function (req, res) {
    service.remove(req, res);
}`;
    }
}




