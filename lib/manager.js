const Employee = require('./employee');

class Manager extends Employee {
    constructor(name, id = 0, email = '', officeNumber = 0) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    getRole() {
        return 'Manager';
    }

    getOfficeNumber() {
        return this.officeNumber;
    }
}





module.exports = Manager;