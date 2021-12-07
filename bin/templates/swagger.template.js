const pluralize = require('pluralize');
const utils = require('../utils/utils');
const fs = require('fs');
const path = require('path');

/**
 * Templates for swagger docs
 */
module.exports = {
  /**
   * Generate swagger routes
   *
   * @param {string} resource
   */
  routes: function (resource) {
    //plural
    const route = pluralize.plural(resource).toLowerCase();
    //first letter upper plural
    const tag = utils.toFirstCase(pluralize.plural(resource));
    //first letter upper singular
    const resourceName = utils.toFirstCase(pluralize.singular(resource));
    //template routes
    let templateRoutes = fs.readFileSync(
      path.join(__dirname, '../resources/swagger-route.yaml'),
      { encoding: 'utf-8' }
    );
    //set values
    templateRoutes = templateRoutes.replace(/\$route\$/g, route);
    templateRoutes = templateRoutes.replace(/\$tag\$/g, tag);
    templateRoutes = templateRoutes.replace(/\$resource\$/g, resource);
    templateRoutes = templateRoutes.replace(/\$resourceName\$/g, resourceName);

    return templateRoutes;
  },
  /**
   * Generate responses default
   * @returns
   */
  responses: function () {
    return fs.readFileSync(
      path.join(__dirname, '../resources/swagger-response.yaml'),
      { encoding: 'utf-8' }
    );
  },

  /**
   * Generate bodies
   * @param {string} resource
   * @returns
   */
  bodies: function (resource) {
    //plural
    const route = pluralize.plural(resource).toLowerCase();
    //first letter upper plural
    const tag = utils.toFirstCase(pluralize.plural(resource));
    //first letter upper singular
    const resourceName = utils.toFirstCase(pluralize.singular(resource));
    //data bodies
    let templateBodies = fs.readFileSync(
      path.join(__dirname, `../resources/swagger-bodies.yaml`),
      { encoding: 'utf-8' }
    );
    //set values
    templateBodies = templateBodies.replace(/\$route\$/g, route);
    templateBodies = templateBodies.replace(/\$tag\$/g, tag);
    templateBodies = templateBodies.replace(/\$resource\$/g, resource);
    templateBodies = templateBodies.replace(/\$resourceName\$/g, resourceName);
    return templateBodies;
  },
};
