'use stric';
const chalk = require('chalk');
const BaseCommand = require('./base_command');
const swaggerGenerate = require('../utils/swagger.util');
const { DOC_TYPE_OPENAPI } = require('../constants/command.const');

/**
 * Generate swagger
 */
module.exports = class OpenApiCommand extends BaseCommand {
  constructor(schematic) {
    super('openapi');
    this._schematic = schematic;
  }

  commandArgs(json) {
    const name = this._schematic;

    if (json) {
      try {
        console.log(chalk.magenta('Building openapi docs and response ...'));
        swaggerGenerate.createSwaggerDocs(DOC_TYPE_OPENAPI);
        swaggerGenerate.createSwaggerResponse(name, json, DOC_TYPE_OPENAPI);
      } catch (err) {
        console.error(chalk.red(`Falha na criação do openapi ${err.message}`));
      }
    } else {
      this.command();
    }
  }

  command() {
    const name = this._schematic;
    try {
      console.log('Building docs route ...');
      swaggerGenerate.createRoute(name, DOC_TYPE_OPENAPI);
    } catch (err) {
      console.error(chalk.red(`Falha na criação openapi ${err.message}`));
    }
  }
};
