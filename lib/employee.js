class Employee {
    constructor(name, id = 0, email = '') {
        this.name = name;
        this.id = id;
        this.email = email;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email
    }

    getRole() {
        return 'Employee';
    }
}

module.exports = Employee;