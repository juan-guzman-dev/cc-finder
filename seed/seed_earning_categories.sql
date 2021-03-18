-- from the terminal run:
-- psql < seed_earning_categories.sql


-- \c capstone_one

DROP TABLE IF EXISTS earning_categories;

CREATE TABLE earning_categories
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

  INSERT INTO earning_categories
    (id, name)
  VALUES
 (1, 'Airline'),
(2, 'Cable Services'),
(3, 'Car Rental'),
(4, 'Department Store'),
(5, 'Drug Store'),
(6, 'Entertainment'),
(7, 'Everywhere'),
(8, 'Gas Station'),
(9, 'Home Improvement Store'),
(10, 'Hotel'),
(11, 'Office Supply Store'),
(12, 'Online Shopping'),
(13, 'Phone Service'),
(14, 'Restaurant'),
(15, 'Selectable Category'),
(16, 'Supermarket'),
(17, 'Utility')