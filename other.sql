insert into department values (1, "development")
insert into department values (2, "marketing")

select * from department

insert into role values (51, "dev manager", 100000, 1);
insert into role values (52, "developer", 85000, 1);

insert into role values (71, "mkt manager", 120000, 2);
insert into role values (72, "product manager", 70000, 2);

insert into employee values (101, "Griffin", "Surett", 51);
insert into employee values (102, "Robert", "Deniero", 52);
insert into employee values (103, "Jake", "Paul", 52);

insert into employee values (104, "Jared", "Dude", 71);
insert into employee values (105, "Joe", "Burrow", 72);
insert into employee values (106, "Amy", "Smith", 72);

select e.id, e.first_name, e.last_name, r.title, r.salary, d.name 
from employee as e, role as r, department as d
where e.role_id = r.id and r.department_id = d.id



`UPDATE employee
 SET first_name = '${answers.first_name}', '${answers.last_name}', '${parseInt(answers.role_id)}'
 WHERE condition`; 