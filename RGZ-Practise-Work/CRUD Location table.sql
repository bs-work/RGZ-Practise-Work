CREATE DATABASE Locationdetail
USE Locationdetail

	CREATE TABLE Location(
	Id INT IDENTITY PRIMARY KEY,
	State NVARCHAR(100),
	City NVARCHAR(100),
	Address NVARCHAR(100),
	Zipcode INT,
	Postalcode INT,
	IsActive BIT NOT NULL DEFAULT 1
	)

CREATE TABLE Card(
Id INT IDENTITY PRIMARY KEY ,
Name NVARCHAR (100),
LocationId INT,
State NVARCHAR(100),
DatePicker DATE,
Uploadfile NVARCHAR (MAX),
Fileurl NVARCHAR(MAX) NOT NULL,
IsActive BIT NOT NULL DEFAULT 1

)

	CREATE TABLE Location(
	Id INT IDENTITY PRIMARY KEY,
	State NVARCHAR(100),
	City NVARCHAR(100),
	Address NVARCHAR(100),
	Zipcode INT,
	Postalcode INT,
	IsActive BIT NOT NULL DEFAULT 1

)

CREATE TABLE Card(
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100),
    LocationId INT,
    State NVARCHAR(100) ,
    DatePicker DATE,
    Uploadfile NVARCHAR(MAX),
    Fileurl NVARCHAR(MAX)NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (LocationId) REFERENCES Location(Id)
);


CREATE TABLE Card(
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100),
	StateId Int NOT NULL,
    State NVARCHAR(100) NOT NULL,
    DatePicker DATE  NOT NULL,
    Uploadfile NVARCHAR(MAX),
    Fileurl NVARCHAR(MAX)NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (StateId) REFERENCES Location(Id)
)

	CREATE TABLE Location(
	Id INT IDENTITY PRIMARY KEY,
	State NVARCHAR(100),
	City NVARCHAR(100),
	Address NVARCHAR(100),
	Zipcode INT,
	Postalcode INT,
	IsActive BIT NOT NULL DEFAULT 1
	)

SELECT * FROM Card
SELECT * FROM Location 

SELECT 
    Card.Id,
    Card.Name,
    Location.State,
    Card.DatePicker,
    Card.Uploadfile,
    Card.Fileurl,
    Card.IsActive
FROM 
    Card
JOIN 
    Location ON Card.State = Location.Id;
	WHERE 
SELECT 
    Card.Id,
    Card.Name,
    Card.LocationId,
    Location.State, 
    Card.DatePicker,
    Card.Uploadfile,
    Card.Fileurl,
    Card.IsActive
FROM 
    Card
JOIN 
    Location ON Card.LocationId = Location.Id
WHERE 
    Card.IsActive = 1;

UPDATE Location
SET State = 'checking'
WHERE Id = 1;
SELECT * FROM Card WHERE Id = 1;
SELECT * FROM Card
SELECT * FROM Location

SELECT * FROM Location WHERE Id = 33;
	SELECT 
		Id,
		Name,
		State,
		REPLACE(CONVERT(VARCHAR(11), DatePicker, 106), ' ', '-') AS FormattedDate,
		Uploadfile,
		Fileurl,
		IsActive
	FROM 
		Card;

CREATE TRIGGER UpdateCardState
ON Location
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(State)
    BEGIN
        UPDATE Card
        SET State = inserted.State
        FROM Card
        INNER JOIN inserted ON Card.State = inserted.State;
    END
END;	



BEGIN TRANSACTION;

UPDATE Location
SET State = @NewState
WHERE Id = @LocationId;

UPDATE Card
SET State = @NewState
WHERE LocationId = @LocationId;

COMMIT TRANSACTION;

BEGIN TRANSACTION;

WITH LocationCTE AS (
    SELECT l.Id
    FROM Location l
    INNER JOIN Card c ON l.Id = c.LocationId
    WHERE l.Id = @LocationId
)

UPDATE l
SET l.State = @NewState
FROM Location l
INNER JOIN LocationCTE lc ON l.Id = lc.Id;

WITH CardCTE AS (
    SELECT c.Id
    FROM Card c
    INNER JOIN Location l ON c.LocationId = l.Id
    WHERE c.LocationId = @LocationId
)

UPDATE c
SET c.State = @NewState
FROM Card c
INNER JOIN CardCTE cc ON c.Id = cc.Id;

COMMIT TRANSACTION;

BEGIN TRANSACTION;

SELECT * FROM Card;

SELECT * FROM Location;


CREATE TRIGGER UpdateCardState
ON Location
AFTER UPDATE
AS
BEGIN
  UPDATE c
  SET c.State = i.State
  FROM Card c
  INNER JOIN INSERTED i ON c.State = i.State
  INNER JOIN DELETED d ON c.State = d.State;
END;
