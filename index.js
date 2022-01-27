const Inquirer = require("inquirer");

const Department = require("./classes/department");
const Role = require("./classes/role");
const Employee = require("./classes/employee");

// Connect to database
const db = require("./db/db");

function handleDbOutput(err, result) {
    if (err) {
        console.log("DB Error: " + err)
    } else {
        console.table(result);
        promptForNextTask();
    }
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
        console.log ("\n");
        switch (response.whatNext.substring(0,2)) {
            case "1.": { Department.selectAll(handleDbOutput); break; } // 1. View all departments 
            case "2.": { Role.selectAll(handleDbOutput); break; } // 2. View all roles
            case "3.": { Employee.selectAll(handleDbOutput); break; } // 3. View all employees
            case "4.": { Department.create(handleDbOutput); break; } // 4. Add a department
            case "5.": { Role.create(handleDbOutput); break; } // 5. Add a role

            case "6.": { // 6. Add an employee
                break;
            }
            case "7.": { // 7. Update an employee's role
                break;
            }
            case "8.": { // 8. Update an employee's manager
                break;
            }
            case "9.": { // 9. View employees by manager
                break;
            }
            case "10": { // 10. View employees by department
                break;
            }
            case "11": { // 11. Delete departments
                break;
            }
            case "12": { // 12. Delete roles
                break;
            }
            case "13": { // 13. Delete employees
                break;
            }
            case "14": { // 14. View a department's total salaries in a department
                break;
            }
            default: {// only EXIT is left!
                console.log("Goodbye!");
                process.exit();
            }
        }
    })
}

promptForNextTask();