'use stric';
const pluralize = require('pluralize');
const fs = require('fs');
const path = require('path');
const swaggerGenerate = require('../../templates/swagger');

module.exports = class RouteHelper {

    create(name) {
        try {

            console.log("Building resources ...");

            const resourceName = pluralize.singular(name);

            const controllerPath = path.join(`./app/api/controllers/${resourceName}.route.js`);
            const controllerGenerate = require('../../templates/controller');

            const servicePath = path.join(`./app/domain/services/${resourceName}.service.js`);
            const serviceGenerate = require('../../templates/service');

            const modelPath = path.join(`./app/domain/models/${resourceName}.model.js`);
            const modelGenerate = require('../../templates/model');

            //controller
            this._write('./app/api/controllers', controllerPath, controllerGenerate.get(name), `Controller '${name}'`)

            //service
            this._write('./app/domain/services', servicePath, serviceGenerate.get(name), `Service '${name}'`)

            //model
            this._write('./app/domain/models', modelPath, modelGenerate.get(name), `Model '${name}'`)

            //swagger route
            swaggerGenerate.createRoute(name);

        }
        catch (err) {

            console.error(err.message);

            var jsonStruct = `
                app
                    api
                        controllers
                        swagger
                    domain
                        service
                        model
                `;

            console.log(`Verifique se estrutura da api está no padrão:\n ${jsonStruct}`);
        }
    }

    _write(dir, path, resource, log) {

        if (!fs.existsSync(dir)) {
            console.log(`Creating directory ${dir} ...`);
            fs.mkdirSync(dir, { recursive: true });
            console.log(`${dir} successfully created`);
        }

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, resource, 'utf-8');
            console.log(`${log} successfully created`);
        }
        else {
            console.error(`Resource '${log}' already exists`);
        }
    }

    swaggerHelper(name, json) {
 
        if (json !== undefined) {
            swaggerGenerate.createResponse(name, json);
        } else {
            swaggerGenerate.createRoute(name);
        }
    } 
}