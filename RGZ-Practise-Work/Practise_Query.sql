CREATE DATABASE TEST
use TEST

CREATE TABLE products(
product_id int identity(1,1)primary key,
product_name nvarchar(50),
price int
)

SELECT * FROM Location


CREATE DATABASE Locationdetail
USE Location

CREATE TABLE Location(
Id INT IDENTITY PRIMARY KEY,
State NVARCHAR(100),
City NVARCHAR(100),
Address NVARCHAR(100),
Zipcode INT,
Postalcode INT,
IsActive INT
)

DROP DATABASE Locationdetail

INSERT INTO dbo.products(product_name,price)
VALUES
('Apple',10),
('Grapes',20),
('Mango',30),
('Watermelon',25),
('Papaya',35),
('Blueberry',40),
('fig',40)

UPDATE products
SET product_name = 'Litchie'
WHERE product_id = 5

DELETE FROM products
WHERE product_name ='fig'

SELECT * FROM products

ALTER TABLE products
ADD location varchar(50)

ALTER TABLE products
DROP COLUMN location

Drop TABLE products


(INNER) JOIN: Returns records that have matching values in both tables
LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table

SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name = table2.column_name;

SELECT ProductsId,ProductName,CategoryID FROM Products 
INNER JOIN Categories ON Products.CategoryID = Categories.Category.ID

SELECT user_id FROM traders
INNER JOIN users ON traders.user_id = users.user.id


SELECT artists_id FROM artists
INNER JOIN songs ON artists.artist.id = songs.artist.id 


SQL LEFT JOIN
--Next, let's explore how the LEFT JOIN works using our orders and deliveries tables.

--Suppose we want to retrieve all the orders along with their corresponding deliveries information. Here's the query:

SELECT 
  orders.order_id, 
  deliveries.delivery_id, 
  deliveries.delivery_date, 
  deliveries.delivery_status
FROM orders
LEFT JOIN deliveries
  ON orders.order_id = deliveries.order_id;
With LEFT JOIN, all rows from the left table (orders) are fetched, along with matching rows from the right table (deliveries). If there is no matching data in the right table, the result will still include the left table's data with NULL values in the columns from the right table.


--SQL RIGHT JOIN
A RIGHT JOIN is the opposite of a LEFT JOIN. It returns all rows from the right table and pairs them with matching rows from the left table. If there is no match, the columns from the left table have NULL values.

Run the following query:

SELECT 
  orders.order_id, 
  deliveries.delivery_id, 
  deliveries.delivery_date, 
  deliveries.delivery_status
FROM deliveries
RIGHT JOIN orders
  ON deliveries.order_id =  orders.order_id;


  he SQL UNION Operator
The UNION operator is used to combine the result-set of two or more SELECT statements.

Every SELECT statement within UNION must have the same number of columns
The columns must also have similar data types
The columns in every SELECT statement must also be in the same order
UNION Syntax
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;