const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');
const utils = require('./utils');
const _ = require('lodash');
const chalk = require('chalk');
const SwaggerTemplate = require('../templates/swagger.template');

/**
 * Swagger 2.0
 *
 * Template swagger route
 */
module.exports = {
  /**
   * Build swagger's route
   *
   * @param {resource} resource is lower case
   */
  createRoute: function (resource) {
    //plural
    let route = pluralize.plural(resource).toLowerCase();
    const swaggerPath = path.join(`./src/app/docs/swagger.yaml`);
    let existSwagger = fs.existsSync(swaggerPath);
    if (existSwagger === true) {
      const swagger = fs.readFileSync(swaggerPath, 'utf8');
      const data = swagger.replace(/\r/g, '').split('\n');

      for (let i = 0; i < data.length; i++) {
        const lineData = data[i];
        if (lineData.includes(route)) {
          console.warn(chalk.red(`Swagger route '${resource}' already exists`));
          return false;
        }
      }
    }
    //get data route
    const dataRoute = SwaggerTemplate.routes(resource);
    //get data bodies
    const dataBodies = SwaggerTemplate.bodies(resource);

    // if (existSwagger) {
    //   //save data route
    //   fs.appendFileSync(swaggerPath, dataRoute.replace('path:', ''), 'utf-8');
    //   //save data bodies
    //   fs.appendFileSync(swaggerPath, dataBodies, 'utf-8');
    //   //show log
    //   console.log(
    //     chalk.green(`Swagger route '${resource}' successfully added`)
    //   );
    // }
    const swaggerPathTmp = path.join('./tmp/swagger');
    const swaggerPathRoute = path.join(swaggerPathTmp, `${route}-routes.yaml`);
    const swaggerPathBodies = path.join(swaggerPathTmp, `${route}-bodies.yaml`);

    if (!fs.existsSync(swaggerPathTmp)) {
      fs.mkdirSync(swaggerPathTmp, { recursive: true });
    }

    fs.writeFileSync(swaggerPathRoute, dataRoute, 'utf-8');
    console.log(chalk.green(`${swaggerPathRoute} successfully created`));

    fs.writeFileSync(swaggerPathBodies, dataBodies, 'utf-8');
    console.log(chalk.green(`${swaggerPathBodies} successfully created`));

    console.warn(
      chalk.yellow(
        `*** NOTE *** => ${swaggerPathRoute} must be add manually at swagger.yaml`
      )
    );
  },

  /**
   * Build swagger's properties response
   *
   * @param {Resource name} resource
   * @param {JSON response} response
   */
  createResponse: function (resource, response) {
    const letters = '/^[A-Za-z]+[0-9]+$/';

    const swaggerPath = `./src/app/docs/swagger.yaml`;

    const swagger = fs.readFileSync(swaggerPath, 'utf8');
    const data = swagger.replace(/\r/g, '').split('\n');
    //name singulare lower + Schema
    let resourceName = resource.toLowerCase() + 'Schema';

    let jsonString = response.replace('{', '').replace('}', '');
    jsonString = jsonString.replace(/'\"/g, '').replace(/\"/g, '');
    let fields = jsonString.split(',');
    let swaggerProperties = '';

    for (let i = 0; i < data.length; i++) {
      const lineData = data[i];
      if (lineData.includes(resourceName)) {
        console.log(
          chalk.yellow(`Response '${pluralize.plural(resource)} already exists`)
        );
        return false;
      }
    }

    for (let i = 0; i < fields.length; i++) {
      let f = fields[i].split(':');
      let field = f[0];
      let value = '';

      //all values from split
      for (let j = 1; j < f.length; j++) {
        value = value + f[j];
      }
      value = value.trim();

      let isString = value.match(letters);

      let isInteger = false;
      let isDecimal = false;
      let isBoolean = false;
      let realPrecision = 2;

      if (isString == null) {
        isInteger = parseInt(value);
        //se for nan nao eh inteiro
        isDecimal = isNaN(isInteger) ? false : value.includes('.');
        //teste o boolean
        isBoolean = isNaN(isInteger)
          ? value === 'true' || value === 'false'
          : false;

        //set scale decimal
        if (isDecimal) {
          realPrecision = value.split('.')[1].length;
        }

        let check = !isNaN(parseFloat(value)) && isFinite(value);

        if (check === false) {
          isInteger = false;
          isDecimal = false;
        }
      }

      let typeSwagger = 'string';

      if (utils.isTimespan(value) && isDecimal === false) {
        typeSwagger = `integer
        format: int64
        description: 'Valor timestamp'`;
      } else if (isInteger && isDecimal === false) {
        typeSwagger = `integer
        format: int64`;
      } else if (isDecimal) {
        typeSwagger = `number
        description: 'Decimal (18,${realPrecision})'`;
      } else if (isBoolean) {
        typeSwagger = 'boolean';
      }
      //defaul string

      let fieldSwagger = `${field}:
        type: ${typeSwagger}
      `;
      swaggerProperties += fieldSwagger;
    }

    const stringData = `# move to swagger docs
components:
  schemas:
    ${resourceName}:
      type: object
      properties:
      ${swaggerProperties}`;

    const swaggerPathRoute = path.join(
      './tmp/swagger',
      `${resource}-response.yaml`
    );
    fs.writeFileSync(swaggerPathRoute, stringData, 'utf-8');
    console.log(chalk.green('Response swagger saved!'));
    // fs.appendFile(swaggerPath, stringData, function (err) {
    //   if (err) throw new Exception('Build response fail =>\n\t' + err);
    //   console.log(chalk.green('Response swagger saved!'));
    // });
  },

  /**
   * Created swagger docs if not exists
   */
  createDocs: function () {
    const dir = './src/app/docs';

    //verify dir swagger
    if (!fs.existsSync(dir)) {
      // console.log(chalk.gray(`Creating ${docType} directory ${dir} ...`));
      fs.mkdirSync(dir, { recursive: true });
      // console.log(chalk.green(`${dir} successfully created`));
    }

    //api path swagger docs exists
    const swaggerPath = path.join(`${dir}/swagger.yaml`);

    //check existe swagger path
    if (!fs.existsSync(swaggerPath)) {
      console.log(chalk.gray(`Creating swagger docs ${swaggerPath} ...`));

      // template swagger tarjet docs
      const tarjet = path.join(`${__dirname}/../resources/swagger.yaml`);

      //copy swagger template
      //destination.yaml will be created or overwritten by default.
      fs.copyFileSync(tarjet, swaggerPath);

      console.log(chalk.green(`Swagger docs successfully created`));

      // fs.copyFile(tarjet, swaggerPath, (err) => {
      //   if (err) {
      //     console.log(err);
      //     throw err;
      //   }
      //   console.log(chalk.green(`API docs successfully created`));
      // });
    }
  },
};
