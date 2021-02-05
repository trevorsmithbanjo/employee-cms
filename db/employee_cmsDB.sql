CREATE DATABASE employee_cmsDB;

USE employee_cmsDB;

CREATE TABLE department(
    id int auto_increment not null,
    name varchar(30) not null,
    primary key (id)
);

CREATE TABLE role(
    id int auto_increment not null,
    title varchar(30) not null,
    salary decimal default 0,
    department_id int not null,
    primary key id,
    foreign key department_id references department (id) 
);

CREATE TABLE employee(
    id int auto_increment not null,
    first_name varchar(30) not null,
    last_name varcahr(30) not null,
    role_id int not null,
    manager_id int null,
    primary key (id),
    foreign key role_id references role (id),
    foreign key manager_id references employee (id)
);

INSERT INTO department (name)
VALUES ("managment"), ("sales"), ("engineer");

INSERT INTO role (title, salary, department_id)
VALUES ("senior", 100000, 3), ("junior", 65000, 3), ("manager", 110000, 1), ("sales rep", 65000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Josh", "Smith", 2), ("Christina", "Smith", 1), ("Wes", "Bos", 3), ("Tony", "Kamel", 4);