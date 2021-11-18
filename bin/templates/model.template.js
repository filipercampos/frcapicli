const Utils = require('../utils/utils');

/**
 * Template model mongoose
 */
module.exports = {
  get: function (resource) {
    const resourceUpper = Utils.toFirstCase(resource);
    return `'use strict';
const mongoose = require('../../../infra/database');
const { BcryptUtil } = require('../../common/utils');//use your logic
// or add your collection name here
// const MongoConst = require('../constants/mongo_const');

const ${resourceUpper}Schema = new mongoose.Schema({
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

//encode password before save
${resourceUpper}Schema.pre('save', async function (next) {
    //TODO pre.save here
    const hash = await BcryptUtil.hash(this.password);
    this.password = hash;
    next();
})

const ${resourceUpper} = mongoose.model('${resource.toLowerCase()}', ${resourceUpper}Schema);

module.exports = ${resourceUpper};`;
  },
};
