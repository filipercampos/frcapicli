'use stric';
const BaseCommand = require('./base_command');
const path = require('path');
const fileUtil = require('../utils/file.util');
const chalk = require('chalk');

/**
 * Lista as portas configuradas no arquivo
 */
module.exports = class FileConfigCommand extends BaseCommand {

    constructor(schematic) {
        super('file');
        this._schematic = schematic;
    }

    /**
     * 
     * @param {{configname:string }} args 
     */
    async commandArgs(args) {
        try {
            console.log(chalk.magenta("Scanning directory to list port config ..."));
            let nothing = 0;
            const tarjet = this._schematic;
            const configName = args.configName != null ? args.configName : 'production.json';
            const envCfg = configName.includes('json') ? configName : `${configName}.json`;
            const dirs = await fileUtil.readDirectory(tarjet);
            console.log(envCfg);

            const ports = [];
            for (let i = 0; i < dirs.length; i++) {
                const file = path.join(tarjet, dirs[i], 'config', envCfg);
                if (fileUtil.existsPath(file)) {
                    const config = require(file);
                    const server = config.SERVER;
                    if (server && server.PORT) {
                        const e = {
                            api: dirs[i],
                            host: server.HOST ? server.HOST : 'Não definido',
                            port: server.PORT
                        }
                        ports.push(e);
                        nothing++;
                    }
                }
            }

            if (nothing === 0) {
                console.log(chalk.red('No config file found'));
            } else {
                console.log('Configution Port');
                console.table(ports);
            }
        }
        catch (err) {
            console.error(chalk.red('Fail to list ports'));
            console.error(chalk.red(err.message));
        }
    }
    command() {
        try {
            const name = this._schematic;

            fileUtil.readDirectory()
            console.log("Run list port API ...");

            //controller
            console.table(log);

        }
        catch (err) {
            console.error(chalk.red('Fail list config'));
            console.error(chalk.red(err.message));
        }
    }

}