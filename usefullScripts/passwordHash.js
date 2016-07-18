var config = require('../config');
var bcrypt = require('bcrypt-nodejs');

module.exports =  function(password){
	return bcrypt.hashSync(password,config.bcryptSalt)
}
