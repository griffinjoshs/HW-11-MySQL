var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employeeTracker"
});
let query;

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by department",
        "View All Employees by Name",
        "View All Employees by Manager",
        "Remove Employee",
        "Add Employee",
        "Update Employee",
        "Add Department",
        "Add Role",
        "Quit"
      ]
    })
    .then(function(answer){
      switch (answer.action) {
        case "View All Employees":
          employeeSearch('all');
          break;
        case "View All Employees by department":
          employeeSearch('department');
          break;
        case "View All Employees by Name":
          employeeSearch('name');
          break;
        case "View All Employees by Manager":
          employeeSearch('manager');
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Quit":
          running = false;
          break;
      }
    })
}
function employeeSearch(searchType) {
  switch (searchType) {
    case "all":
      query = `select e.id, e.first_name, e.last_name, r.title, r.salary, d.name 
    from employee as e, role as r, department as d
    where e.role_id = r.id and r.department_id = d.id`;
      connection.query(query, null, function (err, res) {
        console.table(res)
      })
      break;
    case "department":
      query = `select e.id, e.first_name, e.last_name, r.title, r.salary, d.name 
    from employee as e, role as r, department as d
    where e.role_id = r.id and r.department_id = d.id`;
      query += ' order by d.name'
      connection.query(query, null, function (err, res) {
        console.table(res)
      });
      break;
    case "name":
      query = `select e.id, e.first_name, e.last_name, r.title, r.salary, d.name 
    from employee as e, role as r, department as d
    where e.role_id = r.id and r.department_id = d.id`;
      query += ' order by e.last_name, e.first_name'
      connection.query(query, null, function (err, res) {
        console.table(res)
      });
      break;
    case "manager":
      query = `select e.first_name as "emp first", e.last_name as "emp last", m.first_name as "mgr first", m.last_name as "mgr last"
    from employee as e, employee as m, manages as mg
    where mg.employee_id = e.id and mg.manager_id = m.id`;
      query += ' order by m.last_name, m.first_name'
      connection.query(query, null, function (err, res) {
        console.table(res)
      });
      break;
    default:
      throw "employee search called in illegal argument";
  }
}
function removeEmployee() {
  let allEmployees = [];
  query = `select e.id, e.first_name, e.last_name 
    from employee as e
    order by e.id`
  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      allEmployees.push(
        `id: ${res[i].id}, ${res[i].first_name} ${res[i].last_name}`
      )
    }
    inquirer
      .prompt({
        name: 'employee',
        type: 'list',
        message: 'which employee do you wish to delete?',
        choices: allEmployees
      })
      .then(function (answer) {
        let id = parseInt(answer.employee.substring(4));
        query = `delete from employee where id = ${id}`
        connection.query(query, null, function (err, res) {
          if (err) {
            console.warn('operation failed');
          }
          else {
            console.log(`employee ${id} deleted`)
          }
        }
        )
      })
  })
}

function addEmployee() {
  let employeeRole = [];
  query = `select r.id, r.title
  from role as r`

  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      employeeRole.push(
        `${res[i].id}: ${res[i].title}`
      )
    }
  })

  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Please type the employees first name.',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Please type the employees last name.',
      },
      {
        name: 'role',
        type: 'list',
        message: 'What is the employees role?',
        choices: employeeRole
      },
    ])
    .then(function (answer) {
      let role_id = parseInt(answer.role);
      answer.first_name = answer.first_name.trim()
      answer.last_name = answer.last_name.trim()
      query = `insert into employee (first_name, last_name, role_id) values ('${answer.first_name}', '${answer.last_name}', ${role_id})`
      connection.query(query, null, function (err, res) {
        if (err) {
          console.warn('operation failed');
        }
        else {
          console.log(`employee ${answer.first_name} ${answer.last_name} inserted`)
        }
      }
      )
    })
}
function updateEmployee() {
  let employeeRole = [];
  query = `select r.id, r.title
  from role as r`

  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      employeeRole.push(
        `${res[i].id}: ${res[i].title}`
      )
    }
  })
  let allEmployees = [];
  query = `select e.id, e.first_name, e.last_name 
    from employee as e
    order by e.id`
  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      allEmployees.push(
        `id: ${res[i].id}, ${res[i].first_name} ${res[i].last_name}`
      )
    }
    inquirer
      .prompt({
        name: 'employee',
        type: 'list',
        message: 'which employee do you wish to edit?',
        choices: allEmployees
      })
      .then(function (answer) {
        let id = parseInt(answer.employee.substring(4));
        query = `select first_name, last_name, role_id 
  from employee
  where id = ${id}`
        connection.query(query, null, function (err, res) {
          if (err) {
            console.warn('operation failed');
          }
          else {
            inquirer
            const questions = [
              {
                type: 'input',
                name: 'first_name',
                message: 'change the first name',
                default: res[0].first_name
              },
              {
                type: 'input',
                name: 'last_name',
                message: 'change the last name',
                default: res[0].last_name
              },
              {
                type: 'list',
                name: 'role_id',
                message: 'change employee role',
                default: employeeRole.filter(r => parseInt(r) === res[0].role_id)[0],
                choices: employeeRole
              },
            ];

            inquirer.prompt(questions).then((answers) => {
              query = `UPDATE employee
              SET first_name = '${answers.first_name}', 
              last_name = '${answers.last_name}', role_id = ${parseInt(answers.role_id)}
              WHERE id = ${id}`
              connection.query(query, null, function (err, res) {
                if (err) {
                  console.warn('operation failed', err);
                }
                else {
                  console.log(`success`)
                }
              })
            });
          }
        }
        )
      })
  })
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'department_name',
        type: 'input',
        message: 'Please type the new departments name.',
      },
    ])
    .then(function (answer) {
      answer.department_name = answer.department_name.trim()
      query = `insert into department (name) values ('${answer.department_name}')`
      connection.query(query, null, function (err, res) {
        if (err) {
          console.warn('operation failed');
        }
        else {
          console.log(`department ${answer.department_name} inserted`)
        }
      }
      )
    })
}

function addRole() {
  let allDepartments = [];
  query = `select id, name from department`
  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      allDepartments.push(
        `${res[i].id}: ${res[i].name}`
      )
    }
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Please type the new Role name.',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Please type the salary.',
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Select a department.',
          choices: allDepartments
        },
      ])
      .then(function (answer) {
        answer.title = answer.title.trim()
        query = `insert into role (title, salary, department_id) 
      values ('${answer.title}', ${parseFloat(answer.salary)}, ${parseInt(answer.department_id)})`
        connection.query(query, null, function (err, res) {
          if (err) {
            console.warn('operation failed');
          }
          else {
            console.log(`Role ${answer.title} inserted`)
          }
        }
        )
      })
  }
  )
} 
runSearch();
