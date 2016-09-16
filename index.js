const Liftoff = require('liftoff');
const argv = require('minimist-argv');

const vitamin = new Liftoff({
	name: 'vitamin',
	configName: '.vitaminrc',
	extensions: {},
	configFiles: {
		'.vitaminrc': {
			up: {
				path: '.',
				findUp: true,	
			}
			
		}
	}
});
vitamin.launch({
	cwd: argv.cwd,
	configPath: argv.vitaminrc
}, function(env) {
	if (env.configFiles['.vitaminrc'].up) {
		const path = require('path');
		const spawn = require('child_process').spawn;

		const vitaminAppPath = path.dirname(env.configFiles['.vitaminrc'].up);

		spawn(
			'node',
            ['node_modules/.bin/vitamin'].concat(process.argv.slice(2)),
            {
                env: process.env,
                cwd: vitaminAppPath,
                stdio: 'inherit'
            }
		);
	} else {
		const program = require('commander');
		const init = require('./init');

		program
		.command('new')
		.description('Create a new Vitamin app')
		.option('-N, --skip-npm-install', 'Don\'t run npm install')
		.option('-B, --blank', 'Do not install vitamin example')
		.action(({ blank, skipNpmInstall }) => {
			init({ blank, skipNpmInstall });
		});
		
		program.parse(process.argv);
	}
});

