'use stric';
const BaseCommand = require('./base_command');
const path = require('path');
const fileUtil = require('../utils/file.util');
const chalk = require('chalk');
/**
 * Lista as portas configuradas no arquivo
 */
module.exports = class FileEnvCommand extends BaseCommand {

    constructor(schematic) {
        super('file');
        this._schematic = schematic;
    }

    /**
     * 
     * @param {{configName:string}} args 
     */
    async commandArgs(args) {
        try {
            const tarjet = this._schematic;
            console.log(chalk.magenta("Scanning directory to list port .env ..."));
            let nothing = 0;
            const ports = [];
            const dirs = await fileUtil.readDirectory(tarjet);
            const configName = args.configName != null ? args.configName : '.env';

            for (let i = 0; i < dirs.length; i++) {
                const file = path.join(tarjet, dirs[i], configName);

                if (fileUtil.existsPath(file)) {
                    const config = require('dotenv').config({ path: file }).parsed;
                    if (!config.error) {
                        if(config.host){
                            config['HOST'] = config.host;
                        }
                        if(config.port){
                            config['PORT'] = config.port;
                        }
                        const e = {
                            api: dirs[i],
                            host: config.HOST ? config.HOST : 'Not defined',
                            port: config.PORT
                        }
                        ports.push(e);
                        nothing++;
                    }
                }
            }

            if (nothing === 0) {
                console.log(chalk.red('No config file found\n' + tarjet));
            } else {
                console.log('Configuração de Portas');
                console.table(ports);
            }
        }
        catch (err) {
            console.error(chalk.red('Fail list ports'));
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
            console.error(chalk.red('Falha ao listar portas'));
            console.error(chalk.red(err.message));
        }
    }

}