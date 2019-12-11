class Error {
    constructor(language) {
        this.lg = require("../locales/" + language);
        this.errors = [
            {success: true, statusCode: 201, message: "success"},
            {success: true, statusCode: 202, message: "userNotFound"},
            {success: false, statusCode: 300, message: "queryError"},
            {success: false, statusCode: 301, message: "loginError"},
            {success: false, statusCode: 302, message: "errorPinMax"},
            {success: false, statusCode: 303, message: "errorFile"},
            {success: false, statusCode: 304, message: "xmppidNotFound"},
            {success: false, statusCode: 305, message: "xmppidNotMap"},
            {success: false, statusCode: 500, message: "badRequest"},
            {success: false, statusCode: 501, message: "userNotFound"},
            {success: false, statusCode: 502, message: "userExist"}
        ];
    }

    getError(statusCode) {
        const error = this.errors.find(vl => {
            return statusCode === vl.statusCode;
        });
        if (!error) return null;
        return {success: error.success, statusCode, message: this.lg[error.message]}
    }
}

module.exports = Error;