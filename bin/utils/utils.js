'use stric';
const _ = require('lodash');

module.exports = {

    toFirstCase: (text, upper = true) => {
        let words = text.split(" ");
        let w = words[0];

        if (upper)
            words[0] = w[0].toUpperCase() + w.slice(1);
        else
            words[0] = w[0].toLowerCase() + w.slice(1);

        return words.join(" ");
    },
    isInt: (n) => {
        return Number(n) === n && n % 1 === 0;
    },
    isFloat: (n) => {
        return Number(n) === n && n % 1 !== 0;
    },
    isInt: (n) => {
        return Number(n) === n && n % 1 === 0;
    },
    isTimespan: (value) => {
        let input = parseInt(value);

        let result = isNaN(input)
            ? false
            : typeof input === 'number'
                ? value.length == 13
                    ? true
                    : false
                : false;
        return result;

    }
}