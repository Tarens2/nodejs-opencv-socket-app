var path = require('path')
const PORT = process.env.PORT || 5000

module.exports = {
  httpPort: PORT,
  staticFolder: path.join(__dirname + '/../../client')
};