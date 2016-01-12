/**
 * JavaScript library for message internationalisation (i18n)
 * @author Lovell
 */
var NAP = NAP || {};

NAP.i18n = function() {

    /**
     * Get the message for a given key
     * @param key The identifier of the message
     * @param params Optional array of values to populate {0}, {1} style placeholders with
     */
    var message = function(key, params) {
        var message;
        if (NAP.messages !== "undefined" && NAP.messages[key] !== "undefined") {
            message = NAP.messages[key];
            if (typeof params !== "undefined") {
                // Populate {n} placeholders with the value of params[n]
                message = message.replace(/\{([0-9]+)\}/g, function(match, index) {
                    var value;
                    if (index < params.length) {
                        value = params[index];
                    } else {
                        value = "{" + index + "?}";
                    }
                    return value;
                });
            }
        } else {
            // Could not find key
            message = key + "?";
        }
        return message;
    };

    return {
        "message": message
    };

}();
