# Proyecto Team-waza

Este directorio está organizado para trabajar con una base de datos SQL, en este caso preparada para SQL Server 2019.

## Estructura

- index.html: portada del proyecto
- personas.html: vista para personas que registran solicitudes
- encargados.html: vista para encargados
- css/styles.css: estilos generales
- js/personas.js: lógica para registrar solicitudes
- js/encargados.js: lógica para gestionar solicitudes
- database/01_crear_bd.sql: crea la base de datos
- database/02_tablas.sql: crea las tablas
- database/03_insertar_datos.sql: inserta datos de ejemplo
- assets/: imágenes y archivos estáticos

## Cómo usarlo

1. Abre SQL Server Management Studio 19.
2. Ejecuta 01_crear_bd.sql.
3. Luego ejecuta 02_tablas.sql.
4. Si quieres, ejecuta 03_insertar_datos.sql para ver ejemplos.

## Nota

La idea es que el proyecto frontend quede separado y luego pueda conectarse a esta base de datos SQL.
