'use stric';
const chalk = require('chalk');
const BaseCommand = require('./base_command');
const swaggerGenerate = require('../utils/swagger.util');
const { DOC_TYPE_SWAGGER } = require('../constants/command.const');

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
                console.log(chalk.magenta("Building swagger and response ..."));
                swaggerGenerate.createResponse(name, json, DOC_TYPE_SWAGGER);
            }
            catch (err) {
                console.error(chalk.red(`Falha na criação do swagger ${err.message}`));
            }
        } else {
            this.command();
        }
    }

    command() {
        const name = this._schematic;
        try {

            console.log(chalk.magenta("Building swagger route ..."));
            swaggerGenerate.createRoute(name, DOC_TYPE_SWAGGER);
        }
        catch (err) {
            console.error(chalk.red(`Falha na criação swagger ${err.message}`));
        }
    }

}