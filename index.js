// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
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
    connection.query('SELECT employee.id, first_name, last_name, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id ASC;', (err, res) => {
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
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?'
            }
        ])
        .then((data) => {
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                },
                (err) => {
                    if (err) throw err;
                    connection.query('SELECT title FROM role', (err, result) => {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: 'role',
                                    type: 'list',
                                    choices() {
                                        const choiceArr = [];
                                        result.forEach(({ title }) => {
                                            choiceArr.push(title);
                                        });
                                        return choiceArr;
                                    },
                                    message: 'What is the employees role?',
                                }
                            ])
                            .then((data) => {
                                connection.query('INSERT INTO role SET ?',
                                    {
                                        title: data.title
                                    },
                                    (err) => {
                                        if (err) throw err;
                                        initApp();
                                    }
                                );
                            })
                    })
                });
        });
}


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    initApp();
});