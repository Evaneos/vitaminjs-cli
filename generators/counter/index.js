const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp').sync;

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.option('destination', {
            type: String,
            required: false,
            defaults: '',
            desc: 'Destination of the generated files.'
        });
    }

    initializing() {
        mkdirp(this.destinationPath(this.options.destination, 'src'));
    }

    writing() {
        ['Counter.jsx', 'Index.jsx', 'logo.png', 'reducers.js', 'routes.js', 'style.css'].forEach((filename) => (
            this.fs.copy(
                this.templatePath(filename),
                this.destinationPath(this.options.destination, 'src/' + filename)
            )
        ));
        this.fs.copy(this.templatePath('.vitaminrc'), this.destinationPath(this.options.destination, '.vitaminrc'));
    }
};
