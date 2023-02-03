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
    rmvDept: "Remove Department",
    rmvRole: "Remove Role",
    rmvEmployee: "Remove Employee",
    updateEmRole: "Update Employee Role",
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
                appPrompts.rmvDept,
                appPrompts.rmvRole,
                appPrompts.rmvEmployee,
                appPrompts.updateEmRole,
                appPrompts.exit
            ]
        }) // Whatever the user chooses to do runs the correlating function
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
                case appPrompts.rmvDept:
                        rmvDept();
                        break;
                case appPrompts.rmvRole:
                        rmvRole();
                        break;
                case appPrompts.rmvEmployee:
                    rmvEmployee();
                    break;
                case appPrompts.updateEmRole:
                    updateEmRole();
                    break;
                case appPrompts.exit:
                    connection.end();
                    break;
            }
        });
    }
    
function allDepts() { // Chooses department info from the department table and displays it in order by department id
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
function allRoles() { // Chooses role info from the role table while simplifying the department name, joins the two records with matching values, and orders the info by role id #
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
function allEmployees() { // Chooses employee info from the employee table, joins the employee and the matching records from the manager table, consolidates role ID and department ID, and orders by employee ID number
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
    inquirer.prompt([
        {
            name: 'addDept',
            type: "input",
            message: "What department would you like to add?",
            validate: addDept => {
                if(addDept) {
                    return true;
                } else {
                    console.log('Please enter a department.');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            connection.query(`INSERT INTO department (name) VALUES (?)`, answer.addDept, (err,data) => {
                if (err) throw err;
                console.log(`Added ${answer.addDept} to departments.`)
                allDepts();
            });

        })
}
function addRole() {
    // Creates an array of all departments
    const departments = [];
    connection.query("SELECT * FROM DEPARTMENT", (err, data) => {
      if (err) throw err;
  
      data.forEach(dept => {
        let deptObj = {
          name: dept.name,
          value: dept.id
        }
        departments.push(deptObj);
      });
  
      //question list to get arguments for making new roles
      let questions = [
        {
          type: "input",
          name: "title",
          message: "What is the title of this role?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?"
        },
        {
          type: "list",
          name: "department",
          choices: departments,
          message: "Which department does this role belong to?"
        }
      ];
  
      inquirer.prompt(questions)
      .then(answer => {
        const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
        connection.query(query, [[answer.title, answer.salary, answer.department]], (err, res) => {
          if (err) throw err;
          console.log(`Successfully added ${answer.title} role.`);
          allRoles();
        });
      })
      .catch(err => {
        console.error(err);
      });
    });
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
                let {manager} = await inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        choices: choices,
                        message: "Choose the employee's Manager: "
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
async function rmvEmployee() {
    const answer = await inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the employee you want to remove. "
        }
    ]);
    connection.query(`DELETE FROM employee WHERE ?`,
    {
        id: answer.id
    },
    (err, data) => {
        if (err) throw err;
        }
    )
    console.log("The employee has been removed from the database.");
    allEmployees();
}
async function rmvRole() {
    const answer = await inquirer.prompt([
        {
            name: "role",
            type: "input",
            message: "Enter the ID number of the role you want to remove. "
        }
    ]);
    connection.query(`DELETE FROM role WHERE ?`,
    {
        id: answer.role
    },
    (err, data) => {
        if (err) throw err;
        }
    )
    console.log("The role has been removed from the database.");
    allRoles();
}
async function rmvDept() {
    const answer = await inquirer.prompt([
        {
            name: "dept",
            type: "input",
            message: "Enter the department ID you want to remove. "
        }
    ]);
    connection.query(`DELETE FROM department WHERE ?`,
    {
        id: answer.dept
    },
    (err, data) => {
        if (err) throw err;
        }
    )
    console.log("The department has been removed from the database.");
    allDepts();
}
async function updateEmRole() {
    const employeeId = await inquirer.prompt(getId());

    connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async (err, data) => {
        if(err) throw err;
        const {role} = await inquirer.prompt([
            {
                name: "role",
                type: "list",
                choices: () => data.map(data => data.title),
                message: "What is the new role for this employee? "
            }
        ]);
        let roleId;
        for (const row of data) {
            if(row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId.name}` , async (err, res) => {
            if(err) throw err;
            console.log("Employee's role has been updated.");
            allEmployees();
        })
    })
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

function getId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee's ID?:  "
        }
    ]);
}
