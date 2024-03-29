'use stric';
const BaseCommand = require('./base_command');
const pluralize = require('pluralize');
const path = require('path');
const chalk = require('chalk');

/**
 * Generate controller
 */
module.exports = class ControllerCommand extends BaseCommand {
  constructor(schematic) {
    super('controller');
    this._schematic = schematic;
  }

  command() {
    try {
      const name = this._schematic;

      console.log(chalk.magenta('Building controller ...'));

      const resourceName = pluralize.singular(name);

      const controllerPath = path.join(
        `./src/app/controllers/${resourceName}.controller.js`
      );
      const controllerGenerate = require('../templates/controller.template');

      //controller
      this.generate(
        './src/app/controllers',
        controllerPath,
        controllerGenerate.get(name),
        `Controller ${name}`
      );
    } catch (err) {
      console.error(chalk.red('Fail create controller'));
      console.error(chalk.red(err.message));

      const jsonStruct = `
                app
                    api
                        controllers
                `;
      console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
    }
  }
};
