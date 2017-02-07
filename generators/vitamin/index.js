const generators = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const parseAuthor = require('parse-author');
const path = require('path');
const kebabCase = require('lodash.kebabcase');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.option('blank', {
            type: Boolean,
            required: false,
            defaults: false,
            desc: 'Generates blank project'
        });
        this.option('skipNpmInstall', {
            type: Boolean,
            required: false,
            defaults: false,
            desc: 'Skips npm install'
        });
    },

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        // Pre set the default props from the information we have at this point
        this.props = {
            name: this.pkg.name,
            private: this.pkg.private,
            description: this.pkg.description,
            version: this.pkg.version,
        };

        if (typeof this.pkg.author === 'object') {
            this.props.authorName = this.pkg.author.name;
            this.props.authorEmail = this.pkg.author.email;
            this.props.authorUrl = this.pkg.author.url;
        } else if (typeof this.pkg.author === 'string') {
            const parsedAuthor = parseAuthor(this.pkg.author);
            this.props.authorName = parsedAuthor.name;
            this.props.authorEmail = parsedAuthor.email;
            this.props.authorUrl = parsedAuthor.url;
        }
    },

    prompting: {
        askForModuleName() {
            if (this.pkg.name || this.options.name) {
                this.props.name = this.pkg.name || this.options.name;
                return;
            }

            return askName({
                name: 'name',
                message: 'Module Name',
                default: path.basename(process.cwd()),
                filter: kebabCase,
                validate: str => str.length > 0,
            }, this).then(({ name }) => {
                this.props.name = name;
            });
        },

   askFor() {
            var prompts = [{
                type: 'confirm',
                name: 'private',
                message: 'Private package ?',
                default: this.props.private === true,
            }, {
                name: 'description',
                message: 'Description',
                when: !this.props.description,
            }, {
                name: 'authorName',
                message: 'Author\'s Name',
                when: !this.props.authorName,
                default: this.user.git.name(),
                store: true,
            }, {
                name: 'authorEmail',
                message: 'Author\'s Email',
                when: !this.props.authorEmail,
                default: this.user.git.email(),
                store: true,
            }, {
                name: 'authorUrl',
                message: 'Author\'s Homepage',
                when: !this.props.authorUrl,
                store: true,
            }];

            return this.prompt(prompts).then(props => {
                Object.assign(this.props, props);
            });
        },
    },

    default: function () {
        if (this.options.license && !this.fs.exists(this.destinationPath('LICENSE'))) {
            this.composeWith('license', {
                options: {
                    name: this.props.authorName,
                    email: this.props.authorEmail,
                    website: this.props.authorUrl,
                    defaultLicense: 'ISC',
                }
            }, {
                local: require.resolve('generator-license/app'),
            });
        }
        if (this.options.blank) {
            this.composeWith('vitamin:blank', {}, {local: require.resolve('../blank')});
        } else {
            this.composeWith('vitamin:counter', {}, {local: require.resolve('../counter')});
        }
    },
    writing() {
        // Re-read the content at this point because a composed generator might modify it.
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        Object.assign(pkg, {
            name: kebabCase(this.props.name),
            version: '0.0.0',
            description: this.props.description,
            author: `${this.props.authorName} <${this.props.authorEmail}>${
                this.props.authorUrl && ` (${this.props.authorUrl})`}`,
            keywords: [],
            dependencies: {
                "async-props": "^0.3.2",
                "isomorphic-style-loader": "^1.0.0",
                "react": "^15.3.1",
                "react-helmet": "^3.1.0",
                "react-redux": "^4.4.5",
                "react-router": "^2.7.0",
                "react-router-redux": "^4.0.5",
                "redux": "^3.6.0",
                "vitaminjs": "^1.0.0-rc4"
            }
        }, pkg);

        if (this.props.private) {
            pkg.private = true;
        }

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    installing() {
        if (!this.options.skipNpmInstall) {
            return this.npmInstall();
        }
    },

    end() {
    }
});