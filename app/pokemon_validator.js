module.exports = function (req, res, error_redirect, callback) {
    this.req = req;
    this.res = res;
    this.error_redirect = error_redirect;
    this.callback = callback;
    this.run = require('./run_validation');

    this.req.checkBody('name', 'Name is required.').notEmpty();
    this.req.checkBody('longitude', 'longitude  is required.').notEmpty();
    this.req.checkBody('latitude', 'latitude is required.').notEmpty();
    this.req.checkBody('longitude', 'longitude is a number.').isInt();
    this.req.checkBody('latitude', 'latitude is a number.').isInt();


};