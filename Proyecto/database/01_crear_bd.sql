USE master;
GO

IF DB_ID(N'TeamWaza') IS NULL
BEGIN
    CREATE DATABASE TeamWaza;
END
GO

USE TeamWaza;
GO
