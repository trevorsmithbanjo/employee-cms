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
    database: 'employee_csmDB',
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
                    'Update employee role'
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

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
});