const Utils = require('../utils/utils');

/**
 * Template data model response
 */
module.exports = {
    get: function (resource) {
        return `'use strict';
const mongoose = require('../../../infra/database');
const { BcryptUtil } = require('../../common/utils');
// or add your collection name here
// const MongoConst = require('../constants/mongo_const');

const ${Utils.toFirstCase(resource)}Schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    password: {
        type: String,
        unique: true,
        require: true,
        select: false
    } 
});

//criptografa o password ao salva o usuário
UsuarioSchema.pre('save', async function (next) {
    const hash = await BcryptUtil.hash(this.password);
    this.password = hash;
    next();
})

const ${Utils.toFirstCase(resource)} = mongoose.model('${resource.toLowerCase()}', UsuarioSchema);

module.exports = ${Utils.toFirstCase(resource)};`;
    }

};

