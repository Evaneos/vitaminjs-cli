const yeoman = require('yeoman-environment');

module.exports = function(options) {
	const env = yeoman.createEnv();

	env.registerStub(require('./generators/vitamin'), 'vitamin:generator');

	const generator = env.run('vitamin:generator', options, function(err) {
	    if (err) {
	        console.log(err.stack || err.message || err);
	        return;
	    }
	    console.log('done !');
	});
}