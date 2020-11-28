DROP DATABASE IF EXISTS employeeTracker;
CREATE database employeeTracker;
USE employeeTracker;

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30),
  salary 
  FOREIGN KEY (department_id) REFERENCES department(id)
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  FOREIGN KEY (role_id) REFERENCES role(id)
);