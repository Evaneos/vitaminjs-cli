const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    constructor: function() {
       generators.Base.apply(this, arguments);
       this.option('destination', {
           type: String,
           required: false,
           defaults: '',
           desc: 'Destination of the generated files.'
        });
    },

    initializing() {
        this.mkdir(this.destinationPath(this.options.destination, 'src'));
        
    },
    
    writing() {
        ['Counter.jsx', 'Index.jsx', 'logo.png', 'reducers.js', 'routes.js', 'style.css'].forEach((filename) => (
            this.fs.copy(
                this.templatePath(filename),
                this.destinationPath(this.options.destination, 'src/' + filename)
            )
        ));
        this.fs.copy(this.templatePath('.vitaminrc'), this.destinationPath(this.options.destination, '.vitaminrc'));
    },
});