INSERT INTO department (name)
VALUES  ("Department 1"),
        ("Department 2"),
        ("Department 3"),
        ("Department 4");

INSERT INTO role (title, salary, department_id)
VALUES  ("Title 1", 1.11, 1),
        ("Title 2", 2.22, 1),
        ("Title 3", 3.33, 2),
        ("Title 4", 4.44, 2),
        ("Title 5", 5.55, 3),
        ("Title 6", 6.66, 3),
        ("Title 7", 7.77, 4),
        ("Title 8", 8.88, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Employee", "One", 1, NULL),
        ("Employee", "Two", 2, 1),
        ("Employee", "Three", 3, NULL),
        ("Employee", "Four", 4, 3),
        ("Employee", "Five", 5, NULL),
        ("Employee", "Six", 6, 5),
        ("Employee", "Seven", 7, NULL),
        ("Employee", "Eight", 8, 7);