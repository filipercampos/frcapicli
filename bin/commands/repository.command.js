'use stric';
const pluralize = require('pluralize');
const chalk = require('chalk');
const path = require('path');
const BaseCommand = require('./base_command');

/**
 * Generate repository
 */
module.exports = class RepositoryCommand extends BaseCommand {
  constructor(schematic) {
    super('repository');
    this._schematic = schematic;
  }

  command() {
    const name = this._schematic;
    try {
      console.log(chalk.magenta('Building repository ...'));

      const resourceName = pluralize.singular(name);
      const repositoryPath = path.join(
        `./src/app/domain/repositories/${resourceName}.repository.js`
      );
      const repositoryGenerate = require('../templates/repository.template');

      //repository
      this.generate(
        './src/app/domain/repositories',
        repositoryPath,
        repositoryGenerate.get(name),
        `Repository ${name}`
      );
    } catch (err) {
      console.error(chalk.red('Fail create repository'));
      console.error(chalk.red(err.message));
      const jsonStruct = `
                src
                    app
                        repository
                `;
      console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
    }
  }
};
