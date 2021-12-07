'use stric';
const pluralize = require('pluralize');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const SwaggerUtil = require('../utils/swagger.util');
const SwaggerTemplate = require('../templates/swagger.template');
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
      console.log(chalk.magenta('Building module ...'));

      const resourceName = pluralize.singular(name);

      const controllerPath = path.join(
        `./src/app/controllers/${resourceName}.controller.js`
      );
      const controllerGen = require('../templates/controller.template');

      const routePath = path.join(`./src/app/routes/${resourceName}.route.js`);
      const routeGen = require('../templates/route.template');

      const repositoryPath = path.join(
        `./src/app/domain/repositories/${resourceName}.repository.js`
      );
      const repositoryGen = require('../templates/repository.template');

      const modelPath = path.join(
        `./src/app/domain/models/${resourceName}.model.js`
      );
      const modelGen = require('../templates/model.template');

      //controller
      this._write(
        './src/app/controllers',
        controllerPath,
        controllerGen.get(name),
        `Controller ${name}`
      );

      //route
      this._write(
        './src/app/routes',
        routePath,
        routeGen.get(name),
        `Route ${name}`
      );

      //repository
      this._write(
        './src/app/domain/repositories',
        repositoryPath,
        repositoryGen.get(name),
        `Repository ${name}`
      );

      //model
      this._write(
        './src/app/domain/models',
        modelPath,
        modelGen.get(name),
        `Model ${name}`
      );

      //lib (isolate module)
      // this._write(`./src/libs/${resourceName}/`, servicePath, serviceGenerate.get(name), `Service ${name}`)

      //ensure swagger docs
      SwaggerUtil.createDocs(name);
      //swagger route
      SwaggerUtil.createRoute(name);
    } catch (err) {
      console.error(chalk.red(err.message));

      const jsonStruct = `
                src
                  app
                    common
                    controllers
                    docs
                    domain
                      models
                      repositories
                    middlewares
                    routes
                    shared
                  infra
                  libs
                  main
                `;

      console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
    }
  }

  _write(dir, path, resource, log) {
    if (!fs.existsSync(dir)) {
      console.log(chalk.gray(`Creating directory ${dir} ...`));
      fs.mkdirSync(dir, { recursive: true });
      // console.log(chalk.gray(`${dir} successfully created`));
    }

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, resource, 'utf-8');
      console.log(chalk.green(`${log} successfully created`));
    } else {
      console.error(chalk.red(`Resource '${log}' already exists`));
    }
  }
};
