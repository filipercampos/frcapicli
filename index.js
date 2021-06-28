#! /usr/bin/env node
const comanders = require('commander');
const commands = require('./bin/commands/index');

comanders
    .version('1.0.8')
    .description('A command line interface for Node.js API');

comanders
    .command('generate <schematics> <name> [json]')
    .alias('g')
    .description('creates template: controller, service, model, route and swagger')
    .action(function (schematic, schematicName, json) {

        if (!schematicName) {
            console.error("Resource name is not defined\nUse frc generate schematic resource");
        } else {

            if (schematic === 'route') {
                //all commands
                const Commander = require('./bin/commands/commander');
                new Commander().build(schematicName);
            }
            else if (schematic === 'controller') {
                new commands.ControllerCommand(schematicName).command();
            }
            else if (schematic === 'service') {
                new commands.ServiceCommand(schematicName).command();
            }
            else if (schematic === 'model') {
                new commands.ModelCommand(schematicName).command();
            }
            else if (schematic === 'swagger') {
                new commands.SwaggerCommand(schematicName).commandArgs(json);
            }
            else {
                console.error(`Command ${schematic} invalid. Use g [controller, service, model, route, swagger]`);
            }
        }
    });

comanders
    .command('list <schematics> <path> [type] [configName]')
    .alias('l')
    .description('List ports config file. type = config or env, file, path of directory contains api, configname development.json or .development.env (optional) ')
    .action(function (schematic, path, type = "config", configName) {

        if (!path) {
            console.error("Resource name is not defined\nUse frc l schematic <file>");
        }
        else if (!path) {
            console.error("Specify file");
        }
        else {
            const args = {
                configName: configName || null
            };

            if (schematic === 'ports') {
                if (type && type === 'env') {
                    new commands.FileEnvCommand(path).commandArgs(args);
                } else {
                    new commands.FileConfigCommand(path).commandArgs(args);
                }
            }
            else {
                console.error(`Command ${schematic} invalid. Use path and env (optional)`);
            }
        }
    });

comanders.parse(process.argv);