require('babel-register')

if (process.env.NODE_ENV === 'production') {
  require('./src/server')
} else {
  require('./src/devserver')
}
