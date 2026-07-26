USE AccesoSalud;
GO

INSERT INTO dbo.Solicitudes (Nombre, Colonia, TipoAyuda, Detalle, Calle, Estado)
VALUES
    (N'Juan Pérez', N'Colonia Centro', N'Doctor', N'Requiere valoración médica porque no se puede movilizar.', N'Calle 5', N'Pendiente'),
    (N'María López', N'Colonia San José', N'Traslado', N'Necesita traslado para acudir a consulta.', N'Avenida 10', N'Aceptada'),
    (N'Carlos Ruiz', N'Colonia Las Flores', N'Medicina', N'Requiere medicina y seguimiento de entrega.', N'Calle 8', N'Pendiente');
GO
