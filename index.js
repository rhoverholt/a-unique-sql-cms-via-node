const Inquirer = require("inquirer");
const { Transform } = require('stream'); // for the console.table beautification
const { Console } = require('console'); // for the console.table beautification

const Department = require("./classes/department");
const Role = require("./classes/role");
const Employee = require("./classes/employee");

// Connect to database
const db = require("./db/db");

function table(input) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let outputTable = '';
    for (let row of table.split(/[\r\n]+/)) {
      let r = row.replace(/[^┬]*┬/, '┌');
      r = r.replace(/^├─*┼/, '├');
      r = r.replace(/│[^│]*/, '');
      r = r.replace(/^└─*┴/, '└');
      r = r.replace(/'/g, ' ');
      outputTable += `${r}\n`;
    }
    console.log(outputTable);
  }

function handleDbSelect(err, result) {
    if (err) {
        console.log("DB Error: " + err)
    } else {
        table(result);
        promptForNextTask();
    }
}

function handleDbResponse(err, msg) {
    if (err) {
        console.log("DB Error: " + err);
        promptForNextTask();
    } else {
        console.log(msg);
        promptForNextTask();
    }
}

function handleDbCreate(err, result) {
    handleDbResponse(err, (result.affectedRows !== undefined) ? `\n${result.affectedRows} record${(result.affectedRows) ? 's' : ''} created.\n` : result)
}

function handleDbUpdate(err, result) {
    handleDbResponse(err, (result.affectedRows !== undefined) ? `\n${result.affectedRows} record${(result.affectedRows) ? 's' : ''} updated.\n` : result)
}

function handleDbDelete(err, result) {
    handleDbResponse(err, (result.affectedRows !== undefined) ? `\n${result.affectedRows} record${(result.affectedRows) ? 's' : ''} deleted.\n` : result)
}

// This method prompts the user for the next employee and ends when all employees have been entered.
function promptForNextTask() {
    return Inquirer.prompt([{
        type: "list", 
        name: "whatNext", 
        loop: false,
        pageSize: 15,
        message: "What would you like to do?", 
        choices: [  "1. View all departments", 
                    "2. View all roles", 
                    "3. View all employees", 
                    "4. Add a department", 
                    "5. Add a role", 
                    "6. Add an employee", 
                    "7. Update an employee's role", 
                    "8. Update an employee's manager", 
                    "9. View employees by manager", 
                    "10. View employees by department", 
                    "11. Delete departments", 
                    "12. Delete roles", 
                    "13. Delete employees", 
                    "14. View a department's total salaries in a department",
                    "X. Exit this application"
                ]
    }])
    .then((response) => {
        switch (response.whatNext.substring(0,2)) {
            case "1.": { Department.selectAll(handleDbSelect); break; }         // 1. View all departments 
            case "2.": { Role.selectAll(handleDbSelect); break; }               // 2. View all roles
            case "3.": { Employee.selectAll(handleDbSelect); break; }           // 3. View all employees
            case "4.": { Department.create(handleDbCreate); break; }            // 4. Add a department
            case "5.": { Role.create(handleDbCreate); break; }                  // 5. Add a role
            case "6.": { Employee.create(handleDbCreate); break; }              // 6. Add an employee
            case "7.": { Employee.updateRole(handleDbUpdate); break; }          // 7. Update an employee's role
            case "8.": { Employee.updateManager(handleDbUpdate); break; }       // 8. Update an employee's manager
            case "9.": { Employee.selectByManager(handleDbSelect); break; }     // 9. View employees by manager
            case "10": { Employee.selectByDepartment(handleDbSelect); break; }  // 10. View employees by department
            case "11": { Department.delete(handleDbDelete); break; }            // 11. Delete departments
            case "12": { Role.delete(handleDbDelete); break; }                  // 12. Delete roles
            case "13": { Employee.delete(handleDbDelete); break; }              // 13. Delete employees
            case "14": { Department.viewSalaries(handleDbSelect); break; }      // 14. View a department's total salaries in a department
            default: { // only EXIT is left!
                console.log("Goodbye!");
                process.exit();
            }
        }
    })
}

promptForNextTask();