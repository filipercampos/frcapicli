'use stric';
const BaseCommand = require('./base_command');
const pluralize = require('pluralize');
const path = require('path');
const chalk = require('chalk');

/**
 * Generate route 
 */
module.exports = class RouteCommand extends BaseCommand {

    constructor(schematic) {
        super('route');
        this._schematic = schematic;
    }

    command() {
        try {
            const name = this._schematic;

            console.log(chalk.magenta("Building route ..."));

            const resourceName = pluralize.singular(name);

            const routePath = path.join(`./src/app/routes/${resourceName}.route.js`);
            const routeGenerate = require('../templates/route.template');

            //route
            this.generate('./src/app/routes', routePath, routeGenerate.get(name), `Route ${name}`)

        }
        catch (err) {
            console.error(chalk.red('Route create failed'));
            console.error(chalk.red(err.message));

            const jsonStruct = `
                app
                    api
                        routes
                `;
            console.log(chalk.yellow(`Check API struct:\n ${jsonStruct}`));
        }
    }

}