// Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

// Connect to the database
const connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employees'
    },
    console.log("Connected to the employees database")
);

connection.connect(err => {
    if (err) throw err;
    prompt();
});

// Created app options
const appPrompts = {
    allDepts: "View All Departments",
    allRoles: "View All Roles",
    allEmployees: "View All Employees",
    emByDept: "View All Employees by Department",
    emByManager: "View All Employees by Manager",
    addDept: "Add Department",
    addRole: "Add Role",
    addEmployee: "Add Employee",
    rmvEmployee: "Remove Employee",
    updateEmRole: "Update Employee Role",
    updateEmManager: "Update Employee Manager",
    exit: "Exit"
};

// Asks user what they want to do out of the given choices
function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                appPrompts.allDepts,
                appPrompts.allRoles,
                appPrompts.allEmployees,
                appPrompts.emByDept,
                appPrompts.emByManager,
                appPrompts.addDept,
                appPrompts.addRole,
                appPrompts.addEmployee,
                appPrompts.rmvEmployee,
                appPrompts.updateEmRole,
                appPrompts.updateEmManager,
                appPrompts.exit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case appPrompts.allDepts:
                    allDepts();
                    break;
                case appPrompts.allRoles:
                    allRoles();
                    break;
                case appPrompts.allEmployees:
                    allEmployees();
                    break;
                case appPrompts.emByDept:
                    emByDept();
                    break;
                case appPrompts.emByManager:
                    emByManager();
                    break;
                case appPrompts.addDept:
                    addDept();
                    break;
                case appPrompts.addRole:
                    addRole();
                    break;
                case appPrompts.addEmployee:
                    addEmployee();
                    break;
                case appPrompts.rmvEmployee:
                    rmvEmployee();
                    break;
                case appPrompts.updateEmRole:
                    updateEmRole();
                    break;
                case appPrompts.updateEmManager:
                    updateEmManager();
                    break;
                case appPrompts.exit:
                    connection.end;
                    break;
            }
        });
    }
    
function allDepts() {

}
function allRoles() {

}
function allEmployees() {

}
function emByDept() {

}
function emByManager() {

}
function addDept() {

}
function addRole() {

}
function addEmployee() {

}
function rmvEmployee() {

}
function updateEmRole() {

}
function updateEmManager() {

}
