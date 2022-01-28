const db = require("../db/db");
const Inquirer = require("inquirer");

const nonEmptyValidator = (answer) => {
    return (answer) ? true : "Input required";
}

const isNullableDecimalValidator = (decimal) => ((isNullableIntValidator(decimal))
    || (decimal.match(/[\d,]*(\.\d{2})?/))  //(decimal.match(/^[-+]?[0-9]+\.[0-9]+$/)) 
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

        db.query('SELECT id, name FROM department', createWithDepartments)

        function createWithDepartments(err, result) {
            let departments = [];

            if (err || !result.length) {
                console.log("DB Error: " + err)
                process.exit(0);
            }

            result.forEach(element => departments.push(`ID: ${element.id} Department: ${element.name}`));            

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
                    type: "list", 
                    name: "department", 
                    message: "What is the role's department",
                    choices: departments
                }       
            ])
            .then(({title, salary, department}) => {
                // console.log(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`)
                let department_id = department.split(" ")[1]
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`, callback);
            })
        }
    }

    static delete(callback) {

        db.query("SELECT id, title, salary FROM role ORDER BY title, id", delWithRoles);

        function delWithRoles(err, result) {

            if (err) {console.log("DB Error " + err); process.exit(0)}
            
            let roles = [];
            result.forEach((role) => roles.push(`ID: ${role.id} TITLE: ${role.title} SALARY: ${role.salary}`));
            roles.push("Oops, I don't want to delete anyone");

            return Inquirer.prompt([{
                type: "list", 
                name: "role", 
                message: "Which role should be deleted", 
                choices: roles
            }])
            .then(({role}) => {
                let id = role.split(' ')[1];
                id = (id === "I") ? null : id;
                db.query(`DELETE FROM role WHERE id = ${id}`, callback);
            })
        }
    }
}

module.exports = Role;