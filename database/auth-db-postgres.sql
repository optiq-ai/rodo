-- Authentication tables for RODO project
-- Adapted from Auth-React-JWT for PostgreSQL

-- Table structure for table employee
DROP TABLE IF EXISTS employee CASCADE;

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(80) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL
);

-- Dumping data for table employee
-- NOTE: The passwords are encrypted using BCrypt
-- Default passwords here are: admin

INSERT INTO employee (username, password, first_name, last_name, email)
VALUES 
('admin', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Admin', 'Admin', 'admin@admin.com'),
('manager', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Test', 'Manager', 'test@manager.com'),
('employee', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Test', 'Employee', 'test@employee.com');

-- Table structure for table role
DROP TABLE IF EXISTS role CASCADE;

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Dumping data for table role
INSERT INTO role (name)
VALUES 
('ROLE_EMPLOYEE'),('ROLE_MANAGER'),('ROLE_ADMIN');

-- Table structure for table employee_roles
DROP TABLE IF EXISTS employee_roles;

CREATE TABLE employee_roles (
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) 
    REFERENCES employee (id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_role FOREIGN KEY (role_id) 
    REFERENCES role (id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create index for role_id
CREATE INDEX idx_role_id ON employee_roles (role_id);

-- Dumping data for table employee_roles
INSERT INTO employee_roles (user_id, role_id)
VALUES 
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1);
