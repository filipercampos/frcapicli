'use stric';
const chalk = require('chalk');
const BaseCommand = require('./base_command');
const swaggerGenerate = require('../utils/swagger.util');

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
                swaggerGenerate.createResponse(name, json, 'swagger');
            }
            catch (err) {
                console.error(chalk.red(`Falha na criação do swagger ${err.message}`));
            }
        } else {
            this.command();
        }
    }

    //docType => openApi
    command() {
        const name = this._schematic;
        try {

            console.log(chalk.magenta("Building swagger route ..."));
            swaggerGenerate.createRoute(name, 'swagger');
        }
        catch (err) {
            console.error(chalk.red(`Falha na criação swagger ${err.message}`));
        }
    }

}