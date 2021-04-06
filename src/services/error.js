/**
 * Error structure sent when an error is encountered
 * TODO: check i18n library to handle error in a different way, allowing end users
 */
/**
 * @typedef TQError
 * @type {object}
 * @property {number} statusCode - http status code that is suppose to be sent
 * @property {string} message - error message sent by the error found, try to use a key for i18n
 * @property {Object.<string,string>} data - key are params to change and the message will be either a key in the i18n list or a mesage itself
 */
class BuildError {
  constructor() {
    this.errorList = {
      '001': {
        statusCode: 500,
        message: 'INTERNAL_ERROR',
      },
      '002': {
        statusCode: 400,
        message: 'BAD_REQUEST',
      },
      '003': {
        statusCode: 401,
        message: 'UNAUTHORISED',
      },
      '004': {
        statusCode: 400,
        message: 'INVALID_ARGS',
      },
      '005': {
        statusCode: 400,
        message: 'RATE_LIMIT',
      },
      '006': {
        statusCode: 400,
        message: 'EXPIRED_TOKEN',
      },
      '007': {
        statusCode: 404,
        message: 'SESSION_NOT_FOUND',
      },
      '008': {
        statusCode: 400,
        message: 'FILE_TOO_BIG',
      },
    }
  }

  /**
   * Send an error object to be used to display error information to end users
   * @property {string} errorCode - the application error
   * @property {Object.<string,string>} data - key are params to change and the message will be either a key in the i18n list or a mesage itself
   * @returns {TQError}
   */
  getError(errorCode, data = null) {
    if (data !== null) {
      //parse the data to include it in the message list?
      this.errorList[errorCode]['data'] = data;
    }
    return (this.errorList[errorCode]) ? this.errorList[errorCode] : this.errorList['001'];
  }
}

module.exports = new BuildError();
