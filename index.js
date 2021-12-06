#! /usr/bin/env node
const comanders = require('commander');
const commands = require('./bin/commands');
const chalk = require('chalk');
const CommandConst = require('./bin/constants/command.const');
const HelpUtil = require('./bin/utils/help.util');

comanders
  .version('1.0.8')
  .description('A command line interface for Node.js API');

//CLI API Rest
comanders
  .command('generate <schematics> <name> [json]')
  .alias('g')
  .description('creates template: controller, model, dto, lib, module and docs')
  .action(function (schematic, schematicName, json) {
    if (!schematicName) {
      console.error(
        chalk.red(
          'Resource name is not defined\nUse frc generate schematic resource'
        )
      );
    } else {
      if (schematic === CommandConst.MODULE) {
        new commands.ModuleCommand(schematicName).command();
      } else if (schematic === CommandConst.CONTROLLER) {
        new commands.ControllerCommand(schematicName).command();
      } else if (schematic === CommandConst.ROUTE) {
        new commands.RouteCommand(schematicName).command();
      } else if (schematic === CommandConst.REPOSITORY) {
        new commands.RepositoryCommand(schematicName).command();
      } else if (schematic === CommandConst.MODEL) {
        new commands.ModelCommand(schematicName).command();
      } else if (schematic === CommandConst.DTO) {
        new commands.DtoCommand(schematicName).command();
      } else if (schematic === CommandConst.LIB) {
        new commands.ServiceCommand(schematicName).command();
      } else if (schematic === CommandConst.DOCS) {
        new commands.SwaggerCommand(schematicName).commandArgs(json);
      } else {
        console.error(
          chalk.red(
            `Command ${schematic} invalid. Use frc g [controller, service, model, module or docs]`
          )
        );
      }
    }
  });

//CLI for config and env file
comanders
  .command('list <schematics> <path> [type] [configName]')
  .alias('l')
  .description(
    'List ports config file. type = config or env, file, path of directory contains api, configname development.json or .development.env (optional) '
  )
  .action(function (schematic, path, type = 'config', configName) {
    if (!path) {
      console.error(
        chalk.red('Resource name is not defined\nUse frc l schematic <file>')
      );
    } else if (!path) {
      console.error(chalk.yellow('Specify file'));
    } else {
      const args = {
        configName: configName || null,
      };

      if (schematic === CommandConst.PORTS) {
        if (type && type === 'env') {
          new commands.FileEnvCommand(path).commandArgs(args);
        } else {
          new commands.FileConfigCommand(path).commandArgs(args);
        }
      } else {
        console.error(
          chalk.red(
            `Command ${schematic} invalid. Use frc l [ports path and env(optional)`
          )
        );
      }
    }
  });

//Help
comanders
  .command('help')
  .alias('h')
  .action(function () {
    console.table(HelpUtil.helpOptions());
  });
comanders.parse(process.argv);
