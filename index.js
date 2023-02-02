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
    const query = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY role.id;
    `

    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log(`        VIEW ALL ROLES`);
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
}
function allEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`

    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log(`     VIEW ALL EMPLOYEES`);
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
}
function emByDept() {
    const query = ` SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`

    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log(`     VIEW ALL EMPLOYEES BY DEPARTMENT`);
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
}
function emByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;

    connection.query(query, (err, data) => {
        if(err) throw err;
        console.log('\n ------------------------------');
        console.log(`     VIEW ALL EMPLOYEES BY MANAGER`);
        console.log('\n ------------------------------');
        console.table(data);
        prompt();
    });
}
function addDept() {

}
function addRole() {

}
async function addEmployee() {
    const addName = await inquirer.prompt(getName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async(err, data) => {
        if (err) throw err;
        const {role} = await inquirer.prompt(
            [
                {
                    name: "role",
                    type: "list",
                    choices: () => data.map(data => data.title),
                    message: "What is the employee role? "
                }
            ]);
            let roleId;
            for (const row of data) {
                if (row.title === role) {
                    roleId = row.id;
                    continue;
                }
            }
            connection.query('SELECT * FROM employee', async (err, data) => {
                if (err) throw err;
                let choices = data.map(data => `${data.first_name} ${data.last_name}`);
                choices.push('none');
                let { manager } = await inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        choices: choices,
                        message: 'Choose the employee Manager: '
                    }
                ]);
                let managerID;
                let managerName;
                if (manager === 'none') {
                    managerID = null;
                } else {
                    for (const info of data) {
                        info.fullName = `${info.first_name} ${info.last_name}`;
                        if (info.fullName === manager) {
                            managerID = info.id;
                            managerName = info.fullName;
                            console.log(managerID);
                            console.log(managerName);
                            continue;
                        }
                    }
                }
                console.log('Employee successfully added.');
                connection.query('INSERT INTO employee SET ?',
                {
                    first_name: addName.first,
                    last_name: addName.last,
                    role_id: roleId,
                    manager_id: parseInt(managerID)
                },
                (err, data) => {
                    if (err) throw err;
                    prompt();
                })
            })
    })
}
function rmvEmployee() {

}
function updateEmRole() {

}
function updateEmManager() {

}

function getName() {
    return (
        [
            {
                name: "first",
                type: "input",
                message: "Enter the first name: "
            },
            {
                name: "last",
                type: "input",
                message: "Enter the last name: "
            }
        ]);
}