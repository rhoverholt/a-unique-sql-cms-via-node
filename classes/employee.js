const db = require("../db/db");
const Inquirer = require("inquirer");

const nonEmptyValidator = (answer) => {
    return (answer) ? true : "Input required";
}

const isNullableDecimalValidator = (decimal) => ((isNullableIntValidator(decimal))
    || (decimal.match(/[\d,]*(\.\d{2})?/))  // /^[-+]?[0-9]+\.[0-9]+$/    
    || (!isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10))))

const isNullableIntValidator = (number) => ((number === null)
    || (!isNaN(number) && parseInt(Number(number)) == number && !isNaN(parseInt(number, 10))))


class Employee {
    constructor (first_name, last_name, role_id = NULL, manager_id = NULL) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

    static selectAll(callback) {
        return db.query(`SELECT e.id, e.first_name, e.last_name, e.manager_id, concat(m.first_name, ' ', m.last_name) as manager_name, e.role_id, r.title, r.salary, r.department_id, d.name as department_name 
                            FROM employee as e 
                            LEFT JOIN role as r on r.id = e.role_id 
                            LEFT JOIN department as d on r.department_id = d.id
                            LEFT JOIN employee as m on m.id = e.manager_id`, callback)
    }

    static create(callback) {
     
        db.query('SELECT id, title, salary FROM role', createWithRoles);

        function createWithRoles (err, result) {
            let roles = [];

            if (err) {
                console.log("DB Error: " + err)
                process.exit(0);
            }

            result.forEach(element => roles.push(`ID: ${element.id} Title: ${element.title} Salary: ${element.salary}`));            

            roles.push("Leave it blank");

            db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee ORDER BY last_name, first_name", createWithManager);

            function createWithManager (err, result) {

                let managers = [];

                if (err) {
                    console.log("DB Error: " + err)
                    process.exit(0);
                }
    
                result.forEach(element => managers.push(`ID: ${element.id} Name: ${element.name}`));            
    
                managers.push("Leave it blank");
    
                return Inquirer.prompt([
                    {
                        type: "input", 
                        name: "firstName", 
                        message: "What is the employee's first name", 
                        validate: nonEmptyValidator
                    },
                    {
                        type: "input", 
                        name: "lastName", 
                        message: "What is the employee's last name", 
                        validate: nonEmptyValidator
                    },
                    {
                        type: "list", 
                        name: "role", 
                        message: "What is the employee's role", 
                        choices: roles
                    },
                    {
                        type: "list", 
                        name: "manager", 
                        message: "Who is the employee's manager", 
                        choices: managers
                    }          
            ])
                .then(({firstName, lastName, role, manager}) => {

                    console.log(role);

                    let role_id = (role === "Leave it blank") ? null : role.split(' ')[1];
                    let manager_id = (manager === "Leave it blank") ? null : manager.split(' ')[1];

                    console.log(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}','${lastName}',${role_id},${manager_id})`);

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}','${lastName}',${role_id},${manager_id})`, callback);
                })
            }
        }
    }

    static updateRole(callback) {

        let prompt = [];

        db.query(`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name, r.title as role, CONCAT(m.first_name, ' ', m.last_name) as manager 
                    FROM employee as e
                    LEFT JOIN employee as m ON m.id = e.manager_id
                    LEFT JOIN role as r ON r.id = e.role_id`, getRoles)

        function getRoles(err, result) {

            if (err) {console.log(err); process.exit(0)}

            let employees = [];

            result.forEach(element => employees.push(`ID: ${element.id} NAME: ${element.name} ROLE: ${element.role} MANAGER: ${(!element.manager || element.manager == "null") ? '(none)' : element.manager}`))

            prompt.push(
                {   type: "list",
                    name: "employee",
                    pageSize: 15,
                    message: "Select the employee whose role you wish to update",
                    choices: employees
                }
            )

            db.query(`SELECT r.id, r.title, r.salary, d.name as department
                        FROM role as r
                        LEFT JOIN department as d ON d.id = r.department_id`, updateDB);
                
            function updateDB(err, result) {

                let roles = [];

                result.forEach(element => roles.push(`ID: ${element.id} ROLE: ${element.title} SALARY: ${element.salary} DEPARTMENT: ${element.department}`))

                prompt.push(
                    {   type: "list",
                        name: "role",
                        pageSize: 15,
                        message: "Select the role you'd like to assign",
                        choices: roles
                    }
                )

                return Inquirer.prompt(prompt)
                        .then(({employee, role}) => {
                            console.log (employee);
                            console.log (role);

                            let employee_id = employee.split(" ")[1];
                            let role_id = role.split(" ")[1];
                            
                            console.log (employee_id);
                            console.log (role_id);
                            console.log(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`);

                            db.query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`, callback)
                        })
            }

        }
        // function updateDB() {

        // }
        

        // return Inquirer.prompt([
        //     {
        //         type: "input", 
        //         name: "employee_id", 
        //         message: "What is the employee's ID", 
        //         validate: isNullableIntValidator
        //     },
        //     {
        //         type: "input", 
        //         name: "role_id", 
        //         message: "What is the ID of the employee's new role", 
        //         validate: isNullableIntValidator
        //     }
        // ])
        // .then(({employee_id, role_id}) => {
        //     // console.log(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`)
        //     db.query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`, callback);
        // })
    }

    static updateManager(callback) {

        db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee", updMgrWithEmps)

        function updMgrWithEmps(err, result) {

            if (err) {console.log("DB Error: " + err); process.exit(0);}
        
            let employees = [];

            result.forEach(element => employees.push(`ID: ${element.id} NAME: ${element.name}`))

            return Inquirer.prompt([
                {
                    type: "list", 
                    name: "employee", 
                    message: "Which employee has a new manager", 
                    choices: employees
                }
            ]).then(({employee}) => {
                let employee_id = employee.split(' ')[1];
                let managers = employees.filter((emp) => emp.split(' ')[1] !== employee_id);
                managers.push("Leave it blank");

                return Inquirer.prompt([
                    {
                        type: "list", 
                        name: "manager", 
                        message: "Who is the employee's new manager", 
                        choices: managers
                    }
                ]).then(({manager}) => {
                    // console.log(`UPDATE employee SET manager_id = ${manager_id} WHERE id = ${employee_id}`)
                    
                    let manager_id = manager.split(' ')[1];
                    manager_id = (manager_id == "it") ? "null" : manager_id;
                    db.query(`UPDATE employee SET manager_id = ${manager_id} WHERE id = ${employee_id}`, callback);
                })
            })
        }
    }

    static selectByManager(callback) {

        db.query(`SELECT m.id, CONCAT(m.first_name, ' ', m.last_name) as name
                    FROM employee as m
                    JOIN employee as e ON e.manager_id = m.id
                    GROUP BY m.id`, selectByMgrWithMgrs);

        function selectByMgrWithMgrs(err, result) {

            if(err) {console.log("DB Error: " + err); process.exit(0)}

            let managers = []
            
            result.forEach((element) => managers.push(`ID: ${element.id} NAME: ${element.name}`));

            return Inquirer.prompt([
                {
                    type: "list", 
                    name: "manager", 
                    message: "Which manager would like to see", 
                    choices: managers
                }
            ])
            .then(({manager}) => {
                let manager_id = manager.split(' ')[1];
                db.query(`SELECT * FROM employee WHERE manager_id = ${manager_id}`, callback);
            })
        }
    }

    static selectByDepartment(callback) {

        db.query('SELECT id, name FROM department', selectByDeptWithDept);

        function selectByDeptWithDept(err, result) {
            if (err) {console.log("DB Error " + err); process.exit(0)}

            let departments = [];
            result.forEach((dept) => departments.push(`ID: ${dept.id} DEPARTMENT: ${dept.name}`));

            return Inquirer.prompt([
                {
                    type: "list", 
                    name: "department", 
                    message: "Which department would you like to see", 
                    choices: departments
                }
            ])
            .then(({department}) => {
                let department_id = department.split(' ')[1];
                db.query(`SELECT    department.name as 'Department', 
                                    CONCAT(employee.last_name, ', ', employee.first_name) as 'Employee', 
                                    role.title as 'Title'
                            FROM employee 
                            JOIN role ON employee.role_id = role.id 
                            JOIN department ON role.department_id = department.id
                            WHERE department_id = ${department_id}`, callback);
            })
        }
    }

    static delete(callback) {

        db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee ORDER BY last_name, first_name", delWithEmps);

        function delWithEmps(err, result) {

            if (err) {console.log("DB Error " + err); process.exit(0)}
            
            let employees = [];
            result.forEach((emp) => employees.push(`ID: ${emp.id} NAME: ${emp.name}`));
            employees.push("Oops, I don't want to delete anyone");

            return Inquirer.prompt([{
                type: "list", 
                name: "emp", 
                message: "Which employee would you like to delete", 
                choices: employees
            }])
            .then(({emp}) => {
                let id = emp.split(' ')[1];
                id = (id === "I") ? null : id;
                db.query(`DELETE FROM employee WHERE id = ${id}`, callback);
            })
        }
    }
}

module.exports = Employee;