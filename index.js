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
                    connection.end();
                    break;
            }
        });
    }
    
function allDepts() {
    const query = `SELECT department.id, department.name FROM department ORDER BY department.id;`
    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log(`     VIEW ALL DEPARTMENTS`);
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
}
function allRoles() {

}
function allEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department oN (department.id = role.department_id)
    ORDER BY employee.id;`

    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
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
