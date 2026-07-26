USE AccesoSalud;
GO

IF OBJECT_ID(N'dbo.Solicitudes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Solicitudes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(150) NOT NULL,
        Colonia NVARCHAR(150) NOT NULL,
        TipoAyuda NVARCHAR(50) NOT NULL,
        Detalle NVARCHAR(MAX) NOT NULL,
        Calle NVARCHAR(200) NULL,
        FotoRuta NVARCHAR(255) NULL,
        Estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',
        CodigoMedicamento NVARCHAR(50) NULL,
        FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

IF OBJECT_ID(N'dbo.SeguimientoMedicinas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SeguimientoMedicinas (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SolicitudId INT NOT NULL,
        CodigoMedicamento NVARCHAR(50) NOT NULL,
        Estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',
        FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SeguimientoMedicinas_Solicitudes FOREIGN KEY (SolicitudId)
            REFERENCES dbo.Solicitudes(Id)
    );
END
GO
