const path = require('path')
const dotenv = require('dotenv')
const { onServerListening } = require('./utils/handlers')

dotenv.config({
  path: path.join(__dirname, '..', '.env')
})

const port = process.env.PORT || 3000

require('./app').listen(port, onServerListening(port)).setTimeout(50000)