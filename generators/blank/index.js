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
    
    writing() {
        this.fs.copy(this.templatePath('.vitaminrc'), this.destinationPath(this.options.destination, '.vitaminrc'));
    },
});