const db = require("../db/db");

class Employee {
    constructor (first_name, last_name, role_id = NULL, manager_id = NULL) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

    static selectAll(callback) {
        return db.query("SELECT * FROM employee", callback)
    }
}

module.exports = Employee;