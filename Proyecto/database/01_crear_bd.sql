USE master;
GO

IF DB_ID(N'AccesoSalud') IS NULL
BEGIN
    CREATE DATABASE AccesoSalud;
END
GO

USE AccesoSalud;
GO
