'use stric';
const chalk = require('chalk');
const BaseCommand = require('./base_command');
const swaggerGenerate = require('../utils/swagger.util');

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
                console.log("Building openapi and response ...");
                swaggerGenerate.createResponse(name, json, 'openapi');
            }
            catch (err) {
                console.error(chalk.red(`Falha na criação do openapi ${err.message}`));
            }
        } else {
            this.command();
        }
    }

    command() {
        const name = this._schematic;
        try {
            console.log("Building openapi route ...");
            swaggerGenerate.createRoute(name, 'openapi');
        }
        catch (err) {
            console.error(chalk.red(`Falha na criação openapi ${err.message}`));
        }
    }

}