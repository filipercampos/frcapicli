'use stric';
const fs = require('fs');
const chalk = require('chalk');

module.exports = class BaseCommand {
    constructor(commandName) {
        this._commandName = commandName;
    }

    command() {
        console.log(`Commando ${this._commandName} works !`);
    }

    commandArgs(args) {
        console.log(`Commando ${this._commandName} works with ${args} !`);
    }

    generate(dir, path, resource, log) {
        if (!fs.existsSync(dir)) {
            console.log(chalk.gray(`Creating directory ${dir} ...`));
            fs.mkdirSync(dir, { recursive: true });
            console.log(chalk.green(`${dir} successfully created`));
        }

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, resource, 'utf-8');
            console.log(chalk.green(`${log} successfully created`));
        }
        else {
            console.log(chalk.red(`Resource '${log}' already exists`));
        }
    }
}