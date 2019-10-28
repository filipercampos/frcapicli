'use stric';

module.exports = {

    toFirstCase: (text, upper = true) => {
        var words = text.split(" ");
        var w = words[0];

        if (upper)
            words[0] = w[0].toUpperCase() + w.slice(1);
        else
            words[0] = w[0].toLowerCase() + w.slice(1);
            
        return words.join(" ");
    },
}