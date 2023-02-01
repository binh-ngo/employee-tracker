DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
)

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

USE employees;
INSERT INTO department (name)
VALUES ('Corporate'), 
    ('Back of House'), 
    ('Front of House'), 
    ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Chief Executive Officer', 150000, 1),
    ('Chief Operations Officer', 120000, 1),
    ('Chef de Cuisine', 80000, 2),
    ('Sous Chef', 60000, 2),
    ('Line Cook', 35000, 2),
    ('General Manager', 90000, 3),
    ('Server', 70000, 3),
    ('Senior Marketer', 60000, 4),
    ('Social Media Content Creator', 6000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Marco', 'White', 1, NULL),
    ('Gordon', 'Ramsay', 2, 1),
    ('Heston', 'Blumenthal', 3, NULL),
    ('Bjorn', 'Frantzen', 4, 3),
    ('Tristan', 'Farmer', 5, 3),
    ('Anthony', 'Bourdain', 6, NULL),
    ('Kyle', 'Connaughton', 7, 6),
    ('Andrew', 'Zimmern', 8, NULL),
    ('Paula', 'Deen', 9, 8);

