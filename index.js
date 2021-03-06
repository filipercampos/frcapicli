#! /usr/bin/env node
const comanders = require('commander');
const commands = require('./bin/commands/index');
const swaggerUtil = require('./bin/utils/swagger.util');
const chalk = require('chalk');

comanders
    .version('1.0.8')
    .description('A command line interface for Node.js API');

comanders
    .command('generate <schematics> <name> [json, docType]')
    .alias('g')
    .description('creates template: controller, service, model, route and docs')
    .action(function (schematic, schematicName, json, docType = 'openapi',) {

        if (!schematicName) {
            console.error("Resource name is not defined\nUse frc generate schematic resource");
        } else {

            if (schematic === 'module') {
                new commands.ModuleCommand(schematicName).command();
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
            else if (schematic === 'docs') {
                if (docType && !swaggerUtil.validateDocType(docType)) {
                    console.error(chalk.red('docType invalid. use openapi or swagger'));
                    return;
                }

                if (schematic === 'openapi') {
                    new commands.OpenApiCommand(schematicName).commandArgs(json);
                } else {
                    new commands.SwaggerCommand(schematicName).commandArgs(json);
                }
            }
            else {
                console.error(chalk.red(`Command ${schematic} invalid. Use frc g [controller, service, model, module or docs]`));
            }

        }
    });

comanders
    .command('list <schematics> <path> [type] [configName]')
    .alias('l')
    .description('List ports config file. type = config or env, file, path of directory contains api, configname development.json or .development.env (optional) ')
    .action(function (schematic, path, type = "config", configName) {

        if (!path) {
            console.error(chalk.red("Resource name is not defined\nUse frc l schematic <file>"));
        }
        else if (!path) {
            console.error(chalk.yellow("Specify file"));
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
                console.error(chalk.red(`Command ${schematic} invalid. Use frc l [ports path and env(optional)`));
            }
        }
    });

comanders.parse(process.argv);