const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');
const utils = require('./utils');
const Exception = require('../exception');
const _ = require('lodash');
const chalk = require('chalk');

/**
 * Template swagger route
 */
module.exports = {

  validateDocType:function (docType) {
    if (docType === 'open' || docType === 'swagger') {
      return true;
    }
    return false;
  },

  /**
   * Build swagger's route
   * 
   * @param {resource} Resource is lower case
   */
  createRoute: function (resource, docType) {

    //plural
    let route = pluralize.plural(resource).toLowerCase();

    //first letter upper plural
    let tag = utils.toFirstCase(pluralize.plural(resource));

    //first letter upper singular
    let resourceName = utils.toFirstCase(pluralize.singular(resource));
    const swaggerPath = path.join(`./app/docs/${docType}.yaml`);
    let existSwagger = fs.existsSync(swaggerPath);
    let create = false;

    if (existSwagger === true) {
      const swagger = fs.readFileSync(swaggerPath, 'utf8')
      const data = swagger.replace(/\r/g, '').split('\n');

      for (let i = 0; i < data.length; i++) {
        const lineData = data[i];
        if (lineData.includes(route)) {
          console.warn(`Resource Swagger route '${resource}' already exists`);
          return false;
        }
      }
    } else {

      //create swagger
      this.createSwaggerDocs(docType);
      create = true;
    }

    //create data route
    let dataRoute = `
  # ${tag} #
  /${route}:
    x-swagger-router-controller: ${resource}.controller
    get:
      tags:
        - ${tag}
      summary: Recupera dados de ${route}
      description: 'Recupera dados de ${route}'
      operationId: get${tag}
      parameters: 
      - in: query
        name: value
        type: string
      responses:
        "200":
          description: success
          schema:
            $ref: '#/definitions/get${tag}Response'
        "403":
            description: Acesso Negado
            schema: 
              $ref: '#/definitions/errorResponse' 
    post:
      tags: 
        - ${tag}
      summary: Cadastro de ${resource}
      description: 'Cadastro de ${resource}'
      operationId: post${resourceName}
      parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/post${resourceName}Request'
      responses:
        "201":
          description: created
          schema:
            $ref: '#/definitions/postResponse'
        "403":
          description: Acesso Negado
          schema:
            $ref: '#/definitions/errorResponse'
       #"422":
       #  description: Unprocessable Entity
       #  schema:
       #    $ref: '#/definitions/error${resourceName}PostResponse'
              
  /${route}/{id}:
    x-swagger-router-controller: ${resource}.controller
    get:
      tags:
        - ${tag}
      summary: Recupera dados do ${resource}
      description: 'Recupera dados do ${resource}'
      operationId: get${resourceName}
      parameters:
      - in: path
        name: id
        required: true
        type: integer
        format: int64
      responses:
        "200":
          description: success
          schema:
            $ref: '#/definitions/get${resourceName}Response'
        "403":
            description: Acesso Negado
            schema: 
              $ref: '#/definitions/errorResponse'
    put:
      tags:
        - "${tag}"
      summary: "Atualiza os dados do ${resource}"
      description: "Atualiza os dados do ${resource}"
      operationId: "put${resourceName}"
      parameters:
      - in: path
        name: id
        required: true
        type: integer
        format: int64 
      - in: "body"
        name: "body"
        description: "Objeto JSON com os dados do ${resource}"
        required: true
        schema:
            $ref: '#/definitions/put${resourceName}Request'  
      responses:
        "200":
          description: success
          schema:
            $ref: '#/definitions/putResponse'
        "403":
          description: Acesso Negado
          schema:
            $ref: '#/definitions/errorResponse'
    patch:
      tags:
        - ${tag}
      summary: Altera os dados do ${resource}
      description: 'Altera os dados do ${resource}'
      operationId: patch${resourceName}
      parameters:
      - in: path
        name: id
        required: true
        type: integer
        format: int64 
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/patch${resourceName}Request'  
      responses:
        "200":
          description: success
          schema:
            $ref: '#/definitions/patchResponse'
        "403":
          description: Acesso Negado
          schema:
            $ref: '#/definitions/errorResponse'
  
  #${tag} #
  get${tag}Response:
    type: object
    properties:
      data:
        type: array
        items:
          $ref: '#/definitions/${resource}Response'
  get${resourceName}Response:
    type: object
    properties:
      data:
        $ref: '#/definitions/${resource}Response'
  ${resource}Response:
      type: object
      properties:
        id:
          type: integer
          format: int64
  
  # ${tag} POST Request # 
  post${resourceName}Request:
    type: object
    properties:
      name:
        type: string
  
  #${tag} PUT Request #
  put${resourceName}Request:
    type: object
    properties:
      name:
        type: string    
  
  #${tag} PATCH Request #
  patch${resourceName}Request:
    type: object
    properties:
      name:
        type: string        
        `;

    if (create) {
      fs.appendFileSync(swaggerPath, dataRoute, 'utf-8');
      console.log(chalk.green(`Swagger route ${resource} successfully added`));
    } else {

      const swaggerPathTmp = path.join('./tmp/swagger');
      const swaggerPathRoute = path.join(swaggerPathTmp, `swagger-${route}.yaml`);

      if (!fs.existsSync(swaggerPathTmp)) {
        fs.mkdirSync(swaggerPathTmp, { recursive: true });
      }

      fs.writeFileSync(swaggerPathRoute, dataRoute, 'utf-8');
      console.log(chalk.green(`${swaggerPathRoute} successfully created`));
      console.warn(chalk.yellow(`*** NOTE *** => ${swaggerPathRoute} must be add manually in swagger.yaml`));
    }
  },

  /**
   * Build swagger's properties response
   * 
   * @param {Resource name} resource 
   * @param {JSON response} response 
   */
  createResponse: function (resource, response, docType = 'openapi') {

    const letters = '/^[A-Za-z]+[0-9]+$/';

    const swaggerPath = `./app/docs/${docType}.yaml`;

    this.createSwaggerDocs(docType);

    const swagger = fs.readFileSync(swaggerPath, 'utf8')
    const data = swagger.replace(/\r/g, '').split('\n');

    let resourceUpper = utils.toFirstCase(resource);
    let resourcePluralUpper = pluralize.plural(utils.toFirstCase(resource));

    let jsonString = JSON.stringify(response).replace('{', '').replace('}', '');
    jsonString = jsonString.replace('\"', '').replace('\"', '');
    let fields = jsonString.split(',');
    let swaggerProperties = '';
    var responseName = `${resource}Response`;

    for (let i = 0; i < data.length; i++) {
      const lineData = data[i];
      if (lineData.includes(responseName)) {
        console.warn(`Response '${responseName}  already exists`);
        return false;
      }
    }

    for (let i = 0; i < fields.length; i++) {
      let f = fields[i].split(':');
      let field = f[0];
      let value = '';

      //todos os values do split
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
        isBoolean = isNaN(isInteger) ? value === 'true' || value === 'false' : false;

        //define a precisao do decimal
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

      let fieldSwagger =
        `${field}:
        type: ${typeSwagger}
      `;
      swaggerProperties += fieldSwagger;
    }

    let stringData =
      `\n
  # ${resourceUpper}
  get${resourcePluralUpper}Response:
    type: object
    properties:
      data:
        type: array
        items:
          $ref: '#/definitions/${responseName}'
  get${resourceUpper}Response:
    type: object
    properties:
      data:
        $ref: '#/definitions/${responseName}'
  ${responseName}:
    type: object
    properties:
      ${swaggerProperties}`;

    fs.appendFile(swaggerPath, stringData, function (err) {
      if (err) throw new Exception("Build response fail.=>\n\t" + err);
      console.log(chalk.green('Response swagger saved!'));
    });

  },

  /**
   * Created swagger docs
   */
  createSwaggerDocs: function (docType = 'openapi') {

    let dir = './app/docs';

    if (!fs.existsSync(dir)) {
      console.log(`Creating swagger directory ${dir} ...`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`${dir} successfully created`));
    }

    let swaggerPath = path.join(`${dir}/swagger.yaml`);
    if (!fs.existsSync(swaggerPath)) {
      console.log(`Creating swagger docs ${swaggerPath} ...`);

      const tarjet = path.join(`${__dirname}/${docType}.yaml`);
      // destination.yaml will be created or overwritten by default.
      fs.copyFileSync(tarjet, swaggerPath, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log(chalk.green(`Swagger-docs successfully created`));
      });
    }
  }

}

