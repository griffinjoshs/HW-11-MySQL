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
let allDepartments = [];
connection.connect(function (err) {
  if (err) throw err;
  query = `select d.name 
    from department as d`;
  connection.query(query, null, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      allDepartments.push(res[i].name)
    }
    runSearch();
  })
});
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
    .then(function (answer) {
      // if (answer.action === "Quit"){
      //   break;
      // }
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
        case "Add Roll":
          addRoll();
          break;
        case "Quit":
          return;
      }
    });
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
        console.log(answer)
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
      console.log(answer)
      let role_id = parseInt(answer.role);
      // console.log({role_id, answer})
      query = `insert into employee (first_name, last_name, role_id) values ('${answer.first_name}', '${answer.last_name}', ${role_id})`
      // console.log(query)
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
        console.log(answer)
        let id = parseInt(answer.employee.substring(4));
        query = `select first_name, last_name, role_id 
  from employee
  where id = ${id}`
        connection.query(query, null, function (err, res) {
          if (err) {
            console.warn('operation failed');
          }
          else {
            console.log(`employee ${id} data`)
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
              SET first_name = '${answers.first_name}', '${answers.last_name}', '${parseInt(answers.role_id)}'
              WHERE condition`
              if (err) {
                console.warn('operation failed');
              }
              else {
                console.log(`success`)
              }
              console.log(answers);
            });
          }
        }
        )
      })
  })
}

