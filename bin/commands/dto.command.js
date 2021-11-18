'use stric';
const pluralize = require('pluralize');
const chalk = require('chalk');
const path = require('path');
const BaseCommand = require('./base_command');

/**
 * Generate dto
 */
module.exports = class DtoCommand extends BaseCommand {
  constructor(schematic) {
    super('dto');
    this._schematic = schematic;
  }

  command() {
    const name = this._schematic;
    try {
      console.log(chalk.magenta('Building dto ...'));
      const resourceName = pluralize.singular(name);
      const dtoPath = path.join(`./src/app/domain/dto/${resourceName}.dto.js`);
      const dtoGenerate = require('../templates/dto.template');
      //dto
      this.generate(
        './src/app/domain/dto',
        dtoPath,
        dtoGenerate.get(name),
        `DTO ${name}`
      );
    } catch (err) {
      console.error(chalk.red(`Fail create dto ${err.message}`));
      const jsonStruct = `
                src
                    app
                        domain
                            dto
                            dtos
                            repositories
                `;
      console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
    }
  }
};
