//This layer was removed from route
const pluralize = require('pluralize');
const utils = require('../utils/utils');
/**
 * Template service
 */
module.exports = {
  get: function (resource) {

    let resourceUpper = utils.toFirstCase(resource);
    let resourceLower = pluralize.singular(utils.toFirstCase(resource, false));
    return `'use strict';
const mssql = require('mssql');        

const CommonService = require('./common.service');
const Exception = require('../../api/exceptions/exception');


module.exports = class ${resourceUpper}Service extends CommonService {
    constructor() {
      super();
    }

    /**
     * Recupera dados de ${resource}
     * 
     */
  
    async get(params) {
  
      try {

        //Table type use
        // let myTvp = this.createTableParameters(params.ids);
  
        super.validatePagination(params);
  
        let conn = await this._factory.connectPool();
  
        let result = await conn.request()
          .input('p${resourceUpper}ID', mssql.Int, params.id)
          .input('p${resourceUpper}', mssql.VarChar(100), params.name)
          .input('pDate', mssql.VarChar(10), this.getDate(params.date))
          // .input('pCodigos', myTvp)
          .execute(this._spGet.name);
  
        return super.findResponse(result.recordset, params.numeroPagina, params.linhasPagina);
      }
      catch (err) {
        throw new ProcedureException(this._spGet.name, err.message);
      }
    }
  
    /**
     * Salva um ${resource}
     * 
     * @param {Parâmetros da procedures} params
     */
    async post(params) {
  
      try {
        let conn = await this._factory.connectPool();
        let result = await conn.request()
          .input('pName', mssql.VarChar(100), params.name)
          .execute(Contract.sp${resourceUpper}Post);
  
        return this.getRowsAffected(result);
      }
      catch (err) {
        if (err.class === 11) {
          throw new ErrorException(err.message);
        } else {
          throw new ProcedureException(Contract.sp${resourceUpper}Post, err.message);
        }
      }
    }
  
    /**
    * Atualiza dados do ${resource}
    * 
    * @param {Parâmetros da procedures} params 
    */
    async put(id, params) {
  
      try {
        let conn = await this._factory.connectPool();
        let result = await conn.request()
          .input('p${resourceUpper}ID', mssql.Int, id)
          .input('p${resourceUpper}Name', mssql.VarChar(100), params.name)
          .execute(Contract.sp${resourceUpper}Put);
  
        return this.getRowsAffected(result);
      }
      catch (err) {
        if (err.class === 11) {
          throw new ErrorException(err.message);
        } else {
          throw new ProcedureException(Contract.sp${resourceUpper}Put, err.message);
        }
      }
    }
  
    /**
     * Altera parcialmente dados do ${resource}
     * 
     * @param {Parâmetros da procedures} params 
     */
    async patch(id, params) {
  
      try {
        let conn = await this._factory.connectPool();
        let result = await conn.request()  
          .input('p${resourceUpper}ID', mssql.Int, id)
          .input('p${resourceUpper}Name', mssql.VarChar(100), params.name)         
          .execute(Contract.sp${resourceUpper}Patch);
  
        return this.getRowsAffected(result);
      }
      catch (err) {
        if (err.class === 11) {
          throw new ErrorException(err.message);
        } else {
          throw new ProcedureException(Contract.sp${resourceUpper}Patch, err.message);
        }
      }
    }
  
  }
`;
  }
}



