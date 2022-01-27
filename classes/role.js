const db = require("../db/db");
const Inquirer = require("inquirer");

const nonEmptyValidator = (answer) => {
    return (answer) ? true : "Input required";
}

const isNullableDecimalValidator = (decimal) => ((isNullableIntValidator(decimal))
    || (decimal.match(/^[-+]?[0-9]+\.[0-9]+$/)) 
    || (!isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10))))

const isNullableIntValidator = (number) => ((number === null)
    || (!isNaN(number) && parseInt(Number(number)) == number && !isNaN(parseInt(number, 10))))


class Role {
    constructor (title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    static selectAll(callback) {
        return db.query("SELECT * FROM role", callback)
    }

    static create(callback) {
        return Inquirer.prompt([
            {
                type: "input", 
                name: "title", 
                message: "What is the title of the role", 
                validate: nonEmptyValidator
            },
            {
                type: "input", 
                name: "salary", 
                message: "What is the salary of the role", 
                validate: isNullableDecimalValidator
            },
            {
                type: "input", 
                name: "department_id", 
                message: "What is the id of the role's department", 
                validate: isNullableIntValidator
            }       
    ])
        .then(({title, salary, department_id}) => {
            console.log(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`)
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`, callback);
        })
    }

}

module.exports = Role;