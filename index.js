#! /usr/bin/env node
const comanders = require('commander');
const commands = require('./bin/commands/index');

comanders
    .version('1.0.8')
    .description('A command line interface for Node.js API');

comanders
    .command('g <schematics> <name> [json]')
    .description('creates feature in service, controller, route and swagger')
    .action(function (schematic, schematicName, json) {

        if (!schematicName) {
            console.error("Resource name is not defined\nUse frc g schematic resource");
        } else {
            const Commander = require('./bin/commands/commander');
            let generateResource = new Commander();

            if (schematic === 'route') {//all commands
                generateResource.create(schematicName);
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
                generateResource.swaggerHelper(schematicName, json)
            }
            else {
                console.error(`Command ${schematic} invalid. Use g [controller, service, model, route, swagger]`);
            }
        }
    });

comanders.parse(process.argv);