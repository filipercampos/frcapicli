'use stric';
const pluralize = require('pluralize');
const fs = require('fs');
const path = require('path');

module.exports = {

    create: (name) => {
        try {

            console.log("Building resources ...");

            var resource = pluralize.singular(name).toLowerCase();

            const controllerPath = path.join(`./app/api/controllers/${resource}.route.js`);
            const controllerGenerate = require('../../templates/controller');

            const servicePath = path.join(`./app/api/services/${resource}.service.js`);
            const serviceGenerate = require('../../templates/service');

            const boPath = path.join(`./app/domain/business/${resource}.bo.js`);
            const boGenerate = require('../../templates/business');

            const modelPath = path.join(`./app/domain/model/${resource}.model.js`);
            const modelGenerate = require('../../templates/model');

            const swaggerPath = path.join(`./app/api/swagger/${resource}.swagger.yaml`);
            const swaggerGenerate = require('../../templates/swagger');
            
            //controller
            write(controllerPath, controllerGenerate.get(name), `Controller ${name}`) 

            //service
            write(servicePath, serviceGenerate.get(name), `Service ${name}`) 

            //business object
            write(boPath, boGenerate.get(name), `Business Object ${name}`) 

            //model
            write(modelPath, modelGenerate.get(name), `Model ${name}`) 

            //swagger route
            write(swaggerPath, swaggerGenerate.get(name), `Swagger route ${name}`) 

        }
        catch (err) {

            console.error(err.message);

            var jsonStruct = `
                "api"
                    "controllers": "*.js",
                    "services": "*.js",
                "domain"
                    "business": "*.js",
                    "model": "*.js"
                `;
                 
            console.log(`Verifique se estrutura da api está no padrão:\n ${jsonStruct}`);
        }
    },

    write(path, resource, log) {

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, resource, 'utf-8');
            console.log(`${log} gerado com sucesso`);
        }
        else {
            console.error(`Recurso ${log} já existe`);
        }
    }
}