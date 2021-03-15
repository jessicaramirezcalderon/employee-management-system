const orm = require("./config/orm.js");
const inquirer = require("inquirer");
const consTable = require("console.table");

let updateName;
let updateTable;
let table;

function startInquiry() {
    // Array of questions for user input
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What do you want to do?',
            choices: [
                'Create department.',
                'Create employee.',
                'Create role.',
                'Delete department.',
                'Delete employee.',
                'Delete role.',
                'Update department.',
                'Update employee.',
                'Update role.'
            ],
        },
        {
            name: 'name',
            message: 'What is the name?'
        },
    ])
        .then((answers) => {
            let action;

            switch (answers.choice) {
                case 'Create department.':
                    action = 'create';
                    table = 'departments';
                    break;
                case 'Create employee.':
                    action = 'create';
                    table = 'employees';
                    break;
                case 'Create role.':
                    action = 'create';
                    table = 'roles';
                    break;
                case 'Delete department.':
                    action = 'delete';
                    table = 'departments';
                    break;
                case 'Delete employee.':
                    action = 'delete';
                    table = 'employees';
                    break;
                case 'Delete role.':
                    action = 'delete';
                    table = 'roles';
                    break;
                case 'Update department.':
                    action = 'update';
                    table = 'departments';
                    break;
                case 'Update employee.':
                    action = 'update';
                    table = 'employees';
                    break;
                case 'Update role.':
                    action = 'update';
                    table = 'roles';
                    break;
            }

            if (action === 'create') {
                return orm.create(table, ["name"], [answers.name]);
            } else if (action === 'delete') {
                return orm.delete(table, `name='${answers.name}'`);
            } else {
                updateName = answers.name;
                updateTable = table;

                return inquirer.prompt([
                    {
                        name: 'value',
                        message: 'What is the name you want to set it to?'
                    }
                ]);
            }
        })
        .then((answers) => {
            if (updateName) {
                return orm.update(updateTable, {name: answers.value}, `name='${updateName}'`);
            }
        })
        .then(() => {
            updateName = null;
            updateTable = null;
            return inquirer.prompt([
                {
                    name: 'continue',
                    message: 'Do you wish to continue making changes? (type "yes" or "no")'
                },
            ]);
        })
        .then((answers) => {
            if (answers.continue === 'yes') {
                return startInquiry();
            }
            else {
                return orm.all(table, function(result) {
                    console.table(result);
                });
            }
        })
        .catch((e) => {
            updateName = null;
            console.error(e);
        });
}

startInquiry()
    .then(() => console.log('You are done.'));
