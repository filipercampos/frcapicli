'use stric';
const pluralize = require('pluralize');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const swaggerGenerate = require('../utils/swagger.util');
const BaseCommand = require('./base_command');

///All Commands
module.exports = class ModuleCommand extends BaseCommand {

    constructor(schematic) {
        super('module');
        this._schematic = schematic;
    }

    command() {
        const name = this._schematic;
        try {

            console.log(chalk.magenta("Building module ..."));

            const resourceName = pluralize.singular(name);

            const controllerPath = path.join(`./src/app/controllers/${resourceName}.controller.js`);
            const controllerGenerate = require('../templates/controller');

            // const servicePath = path.join(`./src/libs/${resourceName}/${resourceName}.service.js`);
            // const serviceGenerate = require('../templates/service');

            const modelPath = path.join(`./src/app/domain/models/${resourceName}.model.js`);
            const modelGenerate = require('../templates/model');

            //controller
            this._write('./src/app/controllers', controllerPath, controllerGenerate.get(name), `Controller ${name}`)

            //lib
            // this._write(`./src/libs/${resourceName}/`, servicePath, serviceGenerate.get(name), `Service ${name}`)

            //model
            this._write('./src/app/domain/models', modelPath, modelGenerate.get(name), `Model ${name}`)

            //swagger route
            swaggerGenerate.createRoute(name, 'openapi');

        }
        catch (err) {

            console.error(chalk.red(err.message));

            var jsonStruct = `
                src
                    app
                        controllers
                        docs
                        domain
                            models
                            repositories
                        routes
                    infra
                    libs
                    main
                `;

            console.log(`Verifique se estrutura da api está no padrão:\n ${jsonStruct}`);
        }
    }

    _write(dir, path, resource, log) {

        if (!fs.existsSync(dir)) {
            console.log(chalk.gray(`Creating directory ${dir} ...`));
            fs.mkdirSync(dir, { recursive: true });
            console.log(chalk.gray(`${dir} successfully created`));
        }

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, resource, 'utf-8');
            console.log(chalk.green(`${log} successfully created`));
        }
        else {
            console.error(chalk.red(`Resource '${log}' already exists`));
        }
    }
}