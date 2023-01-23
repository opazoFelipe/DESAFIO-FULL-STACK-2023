/* >> SP LISTAR ALUMNO */
/*
	fecha_creacion: 17-01-2023
	autor: Felipe Opazo Rivas
	Servicios: [{ url: /api/alumnos, método: get }]

    Consideraciones:
    - El ind_paginado va de la mano que el parametro nro_pagina, si ind_paginado = 1, entonces nro_pagina debe ser mayor a 0, se setea a 1 por defecto para evitar errores.
*/

CREATE PROCEDURE dbo.RECUPERA_ALUMNOS
(
	@alu_rut NUMERIC(10, 0) = NULL,
    @alu_nombres VARCHAR(100) = NULL,
    @alu_apellido_paterno VARCHAR(50) = NULL,
    @alu_apellido_materno VARCHAR(50) = NULL,
    @nro_pagina INT = 1, 
    @registros_por_pagina INT = 20
)

AS

DECLARE 
@_nro_pagina INT,
@_registros_por_pagina INT

IF @nro_pagina IS NULL SET @_nro_pagina = 1
ELSE SET @_nro_pagina = @nro_pagina

IF @registros_por_pagina IS NULL SET @_registros_por_pagina = 20
ELSE SET @_registros_por_pagina = @registros_por_pagina

DECLARE @localAlumnos TABLE (
    alu_rut NUMERIC(10, 0),
    alu_dv VARCHAR(1),
    alu_nombres VARCHAR(100),
    alu_apellido_paterno VARCHAR(50),
    alu_apellido_materno VARCHAR(50),
    alu_email VARCHAR(100),
    alu_celular VARCHAR(20),
    anio_ingreso_universidad INT,
    periodo_ingreso_universidad INT
)

INSERT INTO @localAlumnos
SELECT 
alu_rut,
alu_dv,
alu_nombres,
alu_apellido_paterno,
alu_apellido_materno,
alu_email,
alu_celular,
anio_ingreso_universidad,
periodo_ingreso_universidad
FROM UNIVERSIDAD.dbo.ALUMNO WITH(NOLOCK)
WHERE
(alu_rut = @alu_rut OR @alu_rut IS NULL)
AND (alu_nombres LIKE '%' + @alu_nombres + '%' OR @alu_nombres IS NULL)
AND (alu_apellido_paterno LIKE '%' + @alu_apellido_paterno + '%' OR @alu_apellido_paterno IS NULL)
AND (alu_apellido_materno LIKE '%' + @alu_apellido_materno + '%' OR @alu_apellido_materno IS NULL)
ORDER BY 
alu_apellido_paterno, 
alu_apellido_materno
OFFSET (@_nro_pagina - 1) * @_registros_por_pagina ROWS
FETCH NEXT @_registros_por_pagina ROWS ONLY

DECLARE 
@total_registros INT

SET @total_registros = (SELECT COUNT(1) AS total_registros FROM @localAlumnos)

SELECT 
@total_registros as total_registros,
* 
FROM @localAlumnos
GO
/* << SP LISTAR ALUMNO */