if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); //produnction mode에서 개발 시
} else {
    module.exports = require('./dev'); //localhost에서 개발 시
}