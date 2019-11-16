#! /usr/bin/env node
const comandos = require('commander');
const Route = require('./bin/commands/generate/route');

comandos
    .version('1.0.0')
    .description('A command line interface for Node.js API');

comandos
    .command('build <schematics> <name> [json]')
    .description('creates feature in controller, swagger, business and model layers')
    .action(function (schematic, schematicName, json) {

        if (!schematicName) {
            console.error("Resource name is not defined");
        } else {
            let generateResource = new Route();

            if (schematic === 'route') {
                generateResource.create(schematicName);
            }
            else if (schematic === 'swagger') {
                generateResource.swaggerHelper(schematicName, json)
            } else {
                console.error(`Command ${schematic} invalid`);
            }
        }
    });

comandos.parse(process.argv);