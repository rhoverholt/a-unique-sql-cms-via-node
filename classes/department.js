const db = require("../db/db");
const Inquirer = require("inquirer");

const nonEmptyValidator = (answer) => {
    return (answer) ? true : "Input required";
}

const isNullableIntValidator = (number) => ((number === null)
    || (!isNaN(number) && parseInt(Number(number)) == number && !isNaN(parseInt(number, 10))))


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

    static delete(callback) {

        db.query("SELECT id, name FROM department ORDER BY name", delWithDepts);

        function delWithDepts(err, result) {

            if (err) {console.log("DB Error " + err); process.exit(0)}
            
            let departments = [];
            result.forEach((dept) => departments.push(`ID: ${dept.id} NAME: ${dept.name}`));
            departments.push("Oops, I don't want to delete");

            return Inquirer.prompt([{
                type: "list", 
                name: "dept", 
                message: "Which department would you like to delete", 
                choices: departments
            }])
            .then(({dept}) => {
                let id = dept.split(' ')[1];
                id = (id === "I") ? null : id;
                db.query(`DELETE FROM department WHERE id = ${id}`, callback);
            })
        }
    }

    static viewSalaries(callback) {

        db.query("SELECT id, name FROM department ORDER BY name", withDepts);

        function withDepts(err, result) {

            if (err) {console.log("DB Error " + err); process.exit(0)}
            
            let departments = [];
            result.forEach((dept) => departments.push(`ID: ${dept.id} NAME: ${dept.name}`));

            return Inquirer.prompt([{
                type: "list",
                name: "dept",
                message: "Which department do you want",
                choices: departments
            }])
            .then(({dept}) => {
                let id = dept.split(' ')[1];
                db.query(`SELECT d.name as department, sum(r.salary) as salary_total
                            FROM department as d
                            JOIN (SELECT r.id, r.department_id, r.salary * COUNT(e.id) as salary
                                FROM role as r
                                LEFT JOIN employee as e
                                    ON e.role_id = r.id
                                WHERE r.department_id = ${id}
                                GROUP BY r.id) as r
                                ON d.id = r.department_id
                            GROUP BY d.id`, callback) // HAVING d.id = ${id}
            })
        }
    }
}

module.exports = Department;