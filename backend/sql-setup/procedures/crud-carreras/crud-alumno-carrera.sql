/* >> SP INSCRIBIR ALUMNO CARRERA */
/*
	fecha_creacion: 17-01-2023
	autor: Felipe Opazo Rivas
	Servicios: [{ url: /api/carreras/alumnos, método: post }]

	1. Definición: Inscribe un alumno en una carrera

	2. Reglas:
	2.1 La carrera debe existir en la entidad CARERRA, 
	si no existe puede que haya sido eliminada desde otra instancia del cliente del app, 
	en ese caso el usuario requerirá de actualizar la ventana.

	2.2 El alumno debe existir en la entidad ALUMNO,
	si no existe puede que haya sido eliminado desde otra instancia del cliente del app, 
	en ese caso el usuario requerirá de actualizar la ventana.

	2.3 En esta prueba técnica consideraré que un alumno puede inscribir múltiples carreras pero estas no pueden repetirse,
	por lo tanto comprobar que el alumno no esté inscrito en la carrera previamente (ALUMNO_CARRERA)
*/

CREATE PROCEDURE dbo.INSCRIBIR_ALUMNO_CARRERA
(
    @alu_rut NUMERIC(10, 0),
    @crr_codigo INT,
	@login_actualizacion NUMERIC(10, 0)
)

AS

/* Status como http: 
200 -> La inscripción fue exitosa 
400 -> Existe un campo del payload con error
500 -> La transaccion fallo por error inesperado
*/
DECLARE @respuesta TABLE(
	msg_error VARCHAR(100) NULL,
	field_error VARCHAR(100) NULL,
	status_code INT
);

BEGIN TRANSACTION;  
  
BEGIN TRY 

	/* 	2.1 La carrera debe existir en la entidad CARRERA */ 
	IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.CARRERA WHERE crr_codigo = @crr_codigo)
		INSERT INTO @respuesta VALUES ('La carrera seleccionada no existe', 'crr_codigo', 400)
	/* 	2.2 El alumno debe existir en la entidad ALUMNO */
	IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WHERE alu_rut = @alu_rut)
		INSERT INTO @respuesta VALUES ('El alumno seleccionado no existe', 'alu_rut', 400)

	IF NOT EXISTS (SELECT 1 FROM @respuesta)
		BEGIN
		/* 2.3 comprobar que el alumno no esté inscrito en la carrera previamente (ALUMNO_CARRERA) */
		IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO_CARRERA WHERE alu_rut = @alu_rut AND crr_codigo = @crr_codigo)
			INSERT INTO @respuesta VALUES ('El alumno ya se encuentra inscrito en la carrera seleccionada', 'alu_rut', 400)
	END

	/* Ok para inscribir al alumno */
	IF NOT EXISTS (SELECT 1 FROM @respuesta)
	BEGIN
		INSERT INTO UNIVERSIDAD.dbo.ALUMNO_CARRERA (alu_rut, crr_codigo, fecha_creacion, login_actualizacion)
		VALUES
		(@alu_rut, @crr_codigo, GETDATE(), @login_actualizacion)
	END
END TRY  
BEGIN CATCH    
    IF @@TRANCOUNT > 0  
        ROLLBACK TRANSACTION;

	/* Guardar el codigo estado de la transaccion*/
	INSERT @respuesta (status_code) VALUES(500)
END CATCH;  
  
IF @@TRANCOUNT > 0  
    COMMIT TRANSACTION;  

/* Guardar el codigo estado de la transaccion, si todo salio bien debe estar vacía en este punto */
IF NOT EXISTS (SELECT 1 FROM @respuesta)
	INSERT INTO @respuesta (status_code) VALUES (200)

SELECT * FROM @respuesta
GO
/* << SP INSCRIBIR ALUMNO CARRERA */

/* >> SP ELIMINAR_ALUMNO CARRERA */
/*
	fecha_creacion: 17-01-2023
	autor: Felipe Opazo Rivas
	Servicios: [{ url: /api/carreras/alumnos/:crr_codigo/:alu_rut, método: delete }]

    Consideraciones:
	 si el crr_codigo enviado no existe en la entidad CARRERA es debido a:
        - Que la carrera ya fue eliminada del alumno desde otra instancia del cliente de la app.
        - En ese caso se retorna un status 200 indicando que la carrera fue eliminada correctamente. 
        (No afecta a la integridad de la base de datos, ya que no se elimina nada, solo se retorna un status 200)

	Reglas:
	1. Para esta prueba técnica consideraré que las carreras inscritas por los alumnos pueden ser eliminadas sin restricción.
*/
CREATE PROCEDURE dbo.ELIMINAR_ALUMNO_CARRERA
(
	@alu_rut NUMERIC(10, 0),
	@crr_codigo INT
)

AS 
/* Status como http: 
200 -> La carrera fue eliminada correctamente, 
500 -> La transaccion fallo por un error inesperado
*/
DECLARE @respuesta TABLE(
	msg_error VARCHAR(100) NULL,
	status_code INT
);

BEGIN TRANSACTION;  
  
BEGIN TRY 
		DELETE FROM UNIVERSIDAD.dbo.ALUMNO_CARRERA WHERE alu_rut = @alu_rut AND crr_codigo = @crr_codigo
END TRY  
BEGIN CATCH    
    IF @@TRANCOUNT > 0  
        ROLLBACK TRANSACTION;

	/* Guardar el codigo estado de la transaccion*/
	INSERT @respuesta (status_code) VALUES(500)
END CATCH;  
  
IF @@TRANCOUNT > 0  
    COMMIT TRANSACTION;  

/* Guardar el codigo estado de la transaccion, si todo salio bien debe estar vacía en este punto */
IF NOT EXISTS (SELECT 1 FROM @respuesta)
	INSERT INTO @respuesta (status_code) VALUES (200)

SELECT * FROM @respuesta
GO
/* << SP ELIMINAR ALUMNO CARRERA */


/* >> SP RECUPERA_ALUMNOS_CARRERA */
/*  
 fecha_creacion: 20-01-2023  
 autor: Felipe Opazo Rivas  
 Servicios: [{ url: /api/carreras/:crr_codigo, método: get }]  
 
 Consideraciones:  
 - El ind_paginado va de la mano que el parametro nro_pagina, si ind_paginado = 1, entonces nro_pagina debe ser mayor a 0, se setea a 1 por defecto para evitar errores.  
 */
CREATE PROCEDURE dbo.RECUPERA_ALUMNOS_CARRERA (
    @crr_codigo INT = NULL,
	@alu_rut NUMERIC(10, 0) = NULL,
	@escc_codigo INT = NULL,
	@tprc_codigo INT = NULL,
	@crr_nombre VARCHAR(255) = NULL,
    @nro_pagina INT = NULL,
    @registros_por_pagina INT = 20
) AS 

DECLARE 
@_nro_pagina INT,
@_registros_por_pagina INT 

DECLARE @localAlumnos TABLE (
    alu_rut NUMERIC(10, 0),
    alu_dv VARCHAR(1),
    alu_nombres VARCHAR(255),
    alu_apellido_paterno VARCHAR(255),
    alu_apellido_materno VARCHAR(255),
    alu_email VARCHAR(255),
    alu_celular VARCHAR(255),
    anio_ingreso_universidad INT,
    periodo_ingreso_universidad INT,
    crr_codigo INT,
    crr_nombre VARCHAR(255),
    tprc_nombre VARCHAR(255)
)

IF @nro_pagina IS NULL
SET
    @_nro_pagina = 1
    ELSE
SET
    @_nro_pagina = @nro_pagina IF @registros_por_pagina IS NULL
SET
    @_registros_por_pagina = 20
    ELSE
SET
    @_registros_por_pagina = @registros_por_pagina

INSERT INTO @localAlumnos
SELECT
    alu.alu_rut,
	alu.alu_dv,
	alu.alu_nombres,
	alu.alu_apellido_paterno,
	alu.alu_apellido_materno,
	alu.alu_email,
	alu.alu_celular,
	alu.anio_ingreso_universidad,
	alu.periodo_ingreso_universidad,
	crr.crr_codigo,
	crr.crr_nombre,
	tprc.tprc_nombre
FROM
    UNIVERSIDAD.dbo.ALUMNO_CARRERA alc WITH(NOLOCK)
	INNER JOIN UNIVERSIDAD.dbo.ALUMNO alu WITH(NOLOCK) ON
	alc.alu_rut = alu.alu_rut
	INNER JOIN UNIVERSIDAD.dbo.CARRERA crr WITH(NOLOCK) ON
	alc.crr_codigo = crr.crr_codigo
	INNER JOIN UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA tprc WITH(NOLOCK) ON
	crr.tprc_codigo = tprc.tprc_codigo
WHERE
	(alc.crr_codigo = @crr_codigo OR @crr_codigo IS NULL)
	AND (alc.alu_rut = @alu_rut OR @alu_rut IS NULL)
	AND (crr.escc_codigo = @escc_codigo OR @escc_codigo IS NULL)
	AND (crr.tprc_codigo = @tprc_codigo OR @tprc_codigo IS NULL)
	AND (crr.crr_nombre like '%' + @crr_nombre + '%' OR @crr_nombre IS NULL)
ORDER BY
    alu.alu_rut  

DECLARE 
@total_registros INT

SET @total_registros = (SELECT COUNT(1) AS total_registros FROM @localAlumnos)

SELECT 
@total_registros as total_registros,
* 
FROM @localAlumnos
ORDER BY
alu_apellido_paterno
OFFSET (@_nro_pagina - 1) * @_registros_por_pagina ROWS FETCH NEXT @_registros_por_pagina ROWS ONLY