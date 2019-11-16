'use stric';
const pluralize = require('pluralize');
const fs = require('fs');
const path = require('path');
const swaggerGenerate = require('../../templates/swagger');

module.exports = class RouteHelper {

    create(name) {
        try {

            console.log("Building resources ...");

            var resource = pluralize.singular(name).toLowerCase();

            const controllerPath = path.join(`./app/api/controllers/${resource}.route.js`);
            const controllerGenerate = require('../../templates/controller');

            const boPath = path.join(`./app/domain/business/${resource}.bo.js`);
            const boGenerate = require('../../templates/business');

            const modelPath = path.join(`./app/domain/model/${resource}.model.js`);
            const modelGenerate = require('../../templates/model');

            //controller
            this._write('./app/api/controllers', controllerPath, controllerGenerate.get(name), `Controller '${name}'`)

            //business object
            this._write('./app/domain/business', boPath, boGenerate.get(name), `Business Object '${name}'`)

            //model
            this._write('./app/domain/model', modelPath, modelGenerate.get(name), `Model '${name}'`)

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
                        business
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