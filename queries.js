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