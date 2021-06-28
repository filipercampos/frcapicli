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

            console.log("Building model ...");
            const resourceName = pluralize.singular(name);
            const modelPath = path.join(`./app/domain/models/${resourceName}.model.js`);
            const modelGenerate = require('../templates/model');
            //model
            this.generate('./app/domain/models', modelPath, modelGenerate.get(name), `Model ${name}`)
        }
        catch (err) {
            console.error(chalk.red(`Falha na criação do model ${err.message}`));
            const jsonStruct = `
                app
                    domain
                        models
                `;
            console.log(chalk.yellow(`Verifique se estrutura da api está no padrão:\n ${jsonStruct}`));
        }
    }

}