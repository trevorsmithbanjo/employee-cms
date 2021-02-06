// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '85716',
    database: 'employee_cmsDB',
});

// function to initiate app
const initApp = () => {
    inquirer
        .prompt([
            {
                name: 'action',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'Veiw all employees',
                    'Veiw all departments',
                    'View all roles',
                    'Add employee',
                    'Add department',
                    'Add role',
                    'Update employee role',
                    'Exit'
                ],
            }
        ])
        .then((answer) => {
            switch (answer.action) {
                case 'Veiw all employees':
                    veiwAll();
                    break;

                case 'Veiw all departments':
                    veiwAllDepartments();
                    break;

                case 'View all roles':
                    veiwAllRoles();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Add department':
                    addDepartment();
                    break;

                case 'Add role':
                    addRole();
                    break;

                case 'Update employee role':
                    updateRole();
                    break;

                default:
                    connection.end();
                    break;
            }
        })
}

const veiwAll = () => {
    const employees = [];
    connection.query('SELECT employee.id, first_name, last_name, title, salary, department, role_id, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id ASC;', (err, res) => {
        res.forEach(({ id, first_name, last_name, title, salary, department }) => {
            if (err) throw err;
            employees.push({ id, first_name, last_name, title, salary, department });
        });
        console.table(employees);
        initApp();
    })
}

const veiwAllDepartments = () => {
    const departments = [];
    connection.query('SELECT department FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(({ department }) => departments.push({ department }));
        console.table(departments);
        initApp();
    })
}

const veiwAllRoles = () => {
    const roles = [];
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(({ title }) => roles.push({ title }));
        console.table(roles);
        initApp();
    })
}

const addEmployee = () => {
    let roleArr = [];
    connection.query('SELECT title FROM role', (err, results) => {
        if (err) throw err;
        results.forEach(({ title }) => {
            return roleArr.push(title);
        });
        inquirer
            .prompt([
                {
                    name: 'roleID',
                    type: 'list',
                    choices: roleArr,
                    message: 'Select employee role'
                },
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter employees first name'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter employees last name'
                },
            ])
            .then((data) => {
                const roleID = roleArr.indexOf(data.roleID) + 1;
                connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: roleID,
                    },
                    (err) => {
                        if (err) throw err;
                        initApp();
                    }
                )
            })
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: 'Enter the department name.'
            }
        ])
        .then((data) => {
            connection.query('INSERT INTO department SET ?', { department: data.department }, (err) => {
                if (err) throw err;
                console.log(`${data.department} department entered successfully.`);
                initApp();
            })
        })
}

const addRole = () => {
    let departmentArr = [];
    connection.query('SELECT department FROM department', (err, results) => {
        if (err) throw err;
        results.forEach(({ department }) => {
            return departmentArr.push(department);
        });
        inquirer
            .prompt([
                {
                    name: 'roleID',
                    type: 'list',
                    choices: departmentArr,
                    message: 'Selector department for new role'
                },
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter title for role'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter salary for role',
                    validate(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                },
            ])
            .then((data) => {
                const departmentID = departmentArr.indexOf(data.roleID) + 1;
                console.log(departmentID);
                connection.query('INSERT INTO role SET ?', {
                    title: data.title,
                    salary: data.salary,
                    department_id: departmentID,
                },
                    (err) => {
                        if (err) throw err;
                        initApp();
                    })
            })
    });
}

const updateRole = () => {
    let employeeArr = [];
    let roleArr = [];
    connection.query('SELECT first_name, last_name FROM employee', (err, results) => {
        if (err) throw err;
        results.forEach(({ first_name, last_name }) => {
            return employeeArr.push(`${first_name} ${last_name}`);
        })
        connection.query('SELECT title FROM role', (err, newResults) => {
            if (err) throw err;
            newResults.forEach(({ title }) => {
                return roleArr.push(title);
            })
            inquirer
                .prompt([
                    {
                        name: 'employeeID',
                        type: 'list',
                        choices: employeeArr,
                        message: 'Select employee to update'
                    },
                    {
                        name: 'roleID',
                        type: 'list',
                        choices: roleArr,
                        message: 'Select new role'
                    },
                ])
                .then((data) => {
                    const employeeID = employeeArr.indexOf(data.employeeID) + 1;
                    const roleID = roleArr.indexOf(data.roleID) + 1;
                    connection.query('UPDATE employee SET role_id = ? where id = ?', [employeeID, roleID], (err) => {
                        if (err) throw err;
                        console.log(`${data.employeeID} role successfully updated.`);
                        initApp();
                    });
                })
        })
    })
};

//////// Still trying to figure this one out.
const updateManager = () => {
    let managerArr = [];
    connection.query('SELECT id, first_name, last_name FROM employee', (err, results) => {
        if (err) throw err;
        results.forEach(({ first_name, last_name }) => {
            return managerArr.push(`${first_name} ${last_name}`);
        })
        inquirer
            .prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: managerArr,
                    message: 'Select employees new manager'
                },
            ])
            .then((data) => {
                const managerID = managerArr.indexOf(data.manager) + 1;
                connection.query('UPDATE employee SET manager_id = ?', managerID, (err) => {
                    if (err) throw err;
                    initApp();
                })
            })
    })
}


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    initApp();
});