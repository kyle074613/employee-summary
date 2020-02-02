const Employee = require('./employee');

class Engineer extends Employee {
    constructor(name, id = 0, email = '', github) {
        super(name, id, email);

        this.github = github;
    }

    getRole() {
        return 'Engineer';
    }

    getGithub() {
        return this.github;
    }

}

module.exports = Engineer;