// @desc log req to console.

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}%{req.orignalUrl}`);
    next();
}

module.exports = logger;