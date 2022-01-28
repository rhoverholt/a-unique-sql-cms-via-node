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
        return db.query("SELECT r.id as role_id, r.title, r.salary, r.department_id, d.name as department_name FROM role as r LEFT JOIN department as d ON r.department_id = d.id", callback)
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
            // console.log(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`)
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`, callback);
        })
    }

    static delete(callback) {
        return Inquirer.prompt([{
            type: "input", 
            name: "id", 
            message: "What is the ID of the role", 
            validate: isNullableIntValidator
        }])
        .then(({id}) => {
            db.query(`DELETE FROM role WHERE id = ${id}`, callback);
        })
    }
}

module.exports = Role;