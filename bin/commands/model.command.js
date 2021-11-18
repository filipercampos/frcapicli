'use stric';
const pluralize = require('pluralize');
const chalk = require('chalk');
const path = require('path');
const BaseCommand = require('./base_command');

/**
 * Generate model
 */
module.exports = class ModelCommand extends BaseCommand {
  constructor(schematic) {
    super('model');
    this._schematic = schematic;
  }

  command() {
    const name = this._schematic;
    try {
      console.log(chalk.magenta('Building model ...'));
      const resourceName = pluralize.singular(name);
      const modelPath = path.join(
        `./src/app/domain/models/${resourceName}.model.js`
      );
      const modelGenerate = require('../templates/model.template');
      //model
      this.generate(
        './src/app/domain/models',
        modelPath,
        modelGenerate.get(name),
        `Model ${name}`
      );
    } catch (err) {
      console.error(chalk.red(`Fail create model ${err.message}`));
      const jsonStruct = `
                src
                    app
                        domain
                            models
                            repositories
                `;
      console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
    }
  }
};
