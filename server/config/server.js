var path = require('path')
const PORT = process.env.PORT || 3335

module.exports = {
  httpPort: PORT,
  staticFolder: path.join(__dirname + '/../../client')
};