CREATE DATABASE LoginRegistration;
USE LoginRegistration;
CREATE TABLE Registration (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(100),
    Password VARCHAR(100),
    Email VARCHAR(100),
);
SELECT * FROM Registration;
--ALTER Table Registration
--DELETE FROM Registration
--WHERE ID = 2

