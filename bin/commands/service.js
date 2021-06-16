'use stric';
const pluralize = require('pluralize');
const chalk = require('chalk');
const path = require('path');
const BaseCommand = require('./base_command');

/**
 * Generate service
 */
module.exports = class ServiceCommand extends BaseCommand {

    constructor(schematic) {
        super('service');
        this._schematic = schematic;
    }

    command() {
        const name = this._schematic;
        try {

            console.log("Building service ...");

            const resourceName = pluralize.singular(name);
            const servicePath = path.join(`./app/domain/services/${resourceName}.service.js`);
            const serviceGenerate = require('../templates/service');

            //service
            this.generate('./app/domain/services', servicePath, serviceGenerate.get(name), `Service ${name}`)

        }
        catch (err) {
            console.error(chalk.red(' Falha na criação do service'));
            console.error(chalk.red(err.message));
            const jsonStruct = `
                app
                    service
                `;
            console.log(chalk.yellow(`Verifique se estrutura da api está no padrão:\n ${jsonStruct}`));
        }
    }

}