const Inquirer = require("inquirer");
const mySQL = require("mysql2");

// This method prompts the user for the next employee and ends when all employees have been entered.
function promptForNextTask() {
    return Inquirer.prompt([{
        type: "list", 
        name: "whatNext", 
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
            case "1.": {
                break;
            }
            case "2.": {
                break;
            }
            case "3.": {
                break;
            }
            case "4.": {
                break;
            }
            case "5.": {
                break;
            }
            case "6.": {
                break;
            }
            case "7.": {
                break;
            }
            case "8.": {
                break;
            }
            case "9.": {
                break;
            }
            case "10": {
                break;
            }
            case "11": {
                break;
            }
            case "12": {
                break;
            }
            case "13": {
                break;
            }
            case "14": {
                break;
            }
            default: {// only EXIT is left!
                console.log("Goodbye!");
                process.exit();
            }
        }
        console.table(response);
        promptForNextTask();
    })
}

promptForNextTask();