const pluralize = require('pluralize');
const utils = require('../utils/utils');

/**
 * Template business object 
 */
module.exports = { 
    get: function(resource) {
        var resourceUpper = pluralize.singular(utils.toFirstCase(resource));

        return `'use strict';
const CommomBO = require('./commonBO');
const ${resourceUpper}Model = require('../dto/${resource}.model');

const mssql = require('mssql');
const MssqlFactory = require('../persistence/mssql');
const { Contract } = require('../persistence/contract');
const ErrorException = require('../../api/exception/exception');
const ProcedureException = require('../../api/exception/procedure.exception');

module.exports = class ${resourceUpper}BO extends CommomBO {
    constructor() {
        super(
            ${resourceUpper}Model, 
            Contract.sp${resourceUpper}Get,
            'pCodigo${resourceUpper}'
        );
    }
    

  /**
   * Recupera dados de ${resource}
   * 
   * @param {Parâmetros da procedure} params 
   */

  async find(params) {

    try {

      this.validatePagination(params);
      
      //Table type use
      // let tvpRegionais = this.createTableParameters(params.regionaisId);

      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pCodigo${resourceUpper}', mssql.Int, params.id)
		.input('p${resourceUpper}', mssql.VarChar(100), params.name)
        .input('pDate', mssql.DateTime, this.getDate(params.date))
        // .input('pCodigos', tvpRegionais)
        .execute(this._spGet.name);
      return super.findResponse(result.recordset);
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
  async save(params) {

    try {
      let conn = await MssqlFactory;
      let result = await conn.request()        .
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
  async update(id, params) {

    try {
      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pCodigo${resourceUpper}', mssql.Int, id)
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
      let conn = await MssqlFactory;
      let result = await conn.request()

        .input('pCodigo${resourceUpper}', mssql.Int, id)
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




