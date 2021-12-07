'use stric';
const chalk = require('chalk');
const BaseCommand = require('./base_command');
const SwaggerUtil = require('../utils/swagger.util');

/**
 * Generate swagger
 */
module.exports = class SwaggerCommand extends BaseCommand {
  constructor(schematic) {
    super('swagger');
    this._schematic = schematic;
  }

  commandArgs(json) {
    const name = this._schematic;
    if (json) {
      try {
        console.log(chalk.magenta('Building swagger docs and response ...'));
        SwaggerUtil.createDocs();
        SwaggerUtil.createResponse(name, json);
      } catch (err) {
        console.error(chalk.red(`Falha na criação do swagger ${err.message}`));
      }
    } else {
      this.command();
    }
  }

  command() {
    const name = this._schematic;
    try {
      console.log(chalk.magenta('Building swagger route ...'));
      SwaggerUtil.createRoute(name);
    } catch (err) {
      console.error(chalk.red(`Falha na criação swagger ${err.message}`));
    }
  }
};
