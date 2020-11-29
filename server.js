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
          "Add Roll",
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
            updateRoll();
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
  // inquirer
  //   .prompt({
  //     name: "employee",
  //     type: "input",
  //     message: "What employee would you like to search for?"
  //   })
  //   .then(function (answer) {
  //     var query = "SELECT employee, year FROM employeeTracker WHERE ?";
  //     connection.query(query, { employee: answer.employee }, function (err, res) {
  //       for (var i = 0; i < res.length; i++) {
  //         console.log("Position: " + res[i].position + " || Employee: " + res[i].song + " || Year: " + res[i].year);
  //       }
  //       employeeSearch();
  //     });
  //   });
}
// function multiSearch() {
//   var query = "SELECT employee FROM top5000 GROUP BY employee HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].employee);
//     }
//     employeeSearch();
//   });
// }
// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,employee,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || employee: " +
//               res[i].employee +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || employee: " +
//             res[0].employee +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }
// function departmentSearch() {
//   inquirer
//     .prompt({
//       name: "employee",
//       type: "input",
//       message: "What employee would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.employee ";
//       query += "FROM top_albums INNER JOIN top5000 ON (top_albums.employee = top5000.employee AND top_albums.year ";
//       query += "= top5000.year) WHERE (top_albums.employee = ? AND top5000.employee = ?) ORDER BY top_albums.year, top_albums.position";
//       connection.query(query, [answer.employee, answer.employee], function(err, res) {
//         console.log(res.length + " matches found!");
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             i+1 + ".) " +
//               "Year: " +
//               res[i].year +
//               " Album Position: " +
//               res[i].position +
//               " || employee: " +
//               res[i].employee +
//               " || Song: " +
//               res[i].song +
//               " || Album: " +
//               res[i].album
//           );
//         }
//         runSearch();
//       });
//     });
// }