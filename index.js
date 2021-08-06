#! /usr/bin/env node
const comanders = require('commander');
const commands = require('./bin/commands/index');
const swaggerUtil = require('./bin/utils/swagger.util');
const chalk = require('chalk');
const CommandConst = require('./bin/constants/command.const');

comanders
    .version('1.0.8')
    .description('A command line interface for Node.js API');

comanders
    .command('generate <schematics> <name> [docType] [json]')
    .alias('g')
    .description('creates template: controller, model, dto, lib, module or docs')
    .action(function (schematic, schematicName, docType, json) {
        if (!schematicName) {
            console.error("Resource name is not defined\nUse frc generate schematic resource");
        } else {

            if (schematic === CommandConst.MODULE) {
                new commands.ModuleCommand(schematicName).command();
            }
            else if (schematic === CommandConst.CONTROLLER) {
                new commands.ControllerCommand(schematicName).command();
            }
            else if (schematic === CommandConst.ROUTE) {
                new commands.RouteCommand(schematicName).command();
            }
            else if (schematic === CommandConst.REPOSITORY) {
                new commands.RepositoryCommand(schematicName).command();
            }
            else if (schematic === CommandConst.MODEL) {
                new commands.ModelCommand(schematicName).command();
            }
            else if (schematic === CommandConst.DTO) {
                new commands.DtoCommand(schematicName).command();
            }
            else if (schematic === CommandConst.LIB) {
                new commands.ServiceCommand(schematicName).command();
            }
            else if (schematic === CommandConst.DOCS) {
                if (docType && !swaggerUtil.validateDocType(docType)) {
                    console.error(chalk.red('docType invalid. use openapi or swagger'));
                    return;
                }
                if (docType === CommandConst.DOC_TYPE_SWAGGER) {
                    new commands.SwaggerCommand(schematicName).commandArgs(json);
                } else {
                    new commands.OpenApiCommand(schematicName).commandArgs(json);
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

            if (schematic === CommandConst.PORTS) {
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

comanders
    .command('help')
    .alias('h')
    .action(function () {

        const table = [
            {
                name: 'controller',
                description: 'Generate a new model'
            },
            {
                name: 'repository',
                description: 'Generate a new model'
            },
            {
                name: 'route',
                description: 'Generate a new route'
            },
            {
                name: 'model',
                description: 'Generate a new model mongoose'
            },
            {
                name: 'dto',
                description: 'Generate a new dto'
            },
            {
                name: 'module',
                description: 'Generate a new module'
            },
            {
                name: 'lib',
                description: 'Generate a new lib'
            },
            {
                name: 'docs',
                description: 'Generate a route/response swagger'
            },
        ];
        console.table(table);
        console.table([{ name: 1, alias: 'name lis' }]);
    });
comanders.parse(process.argv);