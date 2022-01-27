const db = require("../db/db");
const Inquirer = require("inquirer");

const nonEmptyValidator = (answer) => {
    return (answer) ? true : "Input required";
}


class Department {
    constructor (name) {
        this.name = name;
    }

    static selectAll(callback) {
        db.query("SELECT * FROM department", callback)
    }

    static create(callback) {
        return Inquirer.prompt([{
            type: "input", 
            name: "name", 
            message: "What is the name of the department", 
            validate: nonEmptyValidator
        }])
        .then(({name}) => {
            db.query(`INSERT INTO department (name) VALUES ('${name}')`, callback);
        })
    }
}

module.exports = Department;