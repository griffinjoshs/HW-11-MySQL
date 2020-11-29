DROP DATABASE IF EXISTS employeeTracker;
CREATE database employeeTracker;
USE employeeTracker;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30),
  salary INT,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id),
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  PRIMARY KEY (id)
);

CREATE TABLE manages (
employee_id INT not null,
manager_id INT not null, 
FOREIGN KEY (employee_id) REFERENCES employee(id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
);
