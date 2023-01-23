/* >> SP GUARDAR / ACTUALIZAR ALUMNO */
/*
	fecha_creacion: 20-01-2023
	autor: Felipe Opazo Rivas
	Servicios: [{ url: /api/alumnos, método: post }]

	1. Definición: Guarda o actualiza un alumno

	Reglas:
	Contexto 1: El alumno fue o es creado en una primera fase de registro donde no existen otras operaciones
	que se hayan realizado con este alumno (por ejemplo asociarlo a una carrera, ..)

	1.1 Creacion del Alumno.
	1.1.1 Su rut no debe existir en la entidad ALUMNO.
	1.1.2 Si el alumno fue creado exitosamente se registra en la entidad de acceso de alumnos al sistema donde 
	se guarda su rut y una clave previamente encriptada (los ultimos 4 digitos de su rut antes del guion).

	1.2. Actualizacion del Alumno
	1.2.1 Su rut actual (alu_rut_old) debe existir en la entidad ALUMNO.
	1.2.2 El nuevo rut (alu_rut_new) es igual al original (alu_rut_old)
		- Se permite la actualización de todos los campos del alumno

	1.2.3 El nuevo rut (alu_rut_new) es distinto al original (alu_rut_old)
		- Comprobar que el nuevo rut no exista para otro alumno en la entidad  
		- Si no existe se permite la actualización del rut y el resto de campos.  
		- Si existe no se permite actualizar el alumno.  

	Contexto 2: El alumno ya fue creado y ya ha pasado por distintas operaciones (por ejemplo ya fue asociado a una carrera, ...)
	2.1 Actualizacion del Alumno.
		- El alumno a actualizar debe existir en la entidad (alu_rut_old)  

		 - El nuevo rut (alu_rut_new) es igual al original (alu_rut_old)  
			- Se permite la actualización de todos los campos de la carrera 
			
		 - El nuevo codigo (alu_rut_new) es distinto al original (alu_rut_old)   
			- Se permite actualizar el rut solo si el alumno no tiene una carrera inscrita

	/* En cualquier caso que sea posible actualizar el rut del alumno se debe actualizar en la entidad ACCESO_ALUMNOS y tambien su clave */
*/
CREATE PROCEDURE dbo.GUARDAR_ALUMNO
(
    @alu_rut_new numeric(10, 0),
	@alu_dv char(1),
	@alu_rut_old numeric(10, 0) = NULL,
	@alu_nombres varchar(100) = NULL,
	@alu_apellido_paterno varchar(50) = NULL,
	@alu_apellido_materno varchar(50) = NULL,
	@password_encriptada varchar(255),
	@login_actualizacion numeric(10, 0), 
	@alu_email varchar(100) = NULL,
	@alu_celular numeric(10, 0) = NULL,
	@anio_ingreso_universidad int = NULL,
	@periodo_ingreso_universidad int = NULL
)

AS

/* Status como http: 
500 -> La transaccion fallo por error inesperado, 
200 -> El alumno fue creado exitosamente
*/
DECLARE @respuesta TABLE(  
	msg_error VARCHAR(100) NULL,  
	field_error VARCHAR(100) NULL,  
	status_code INT  
);  

BEGIN TRANSACTION;  
  
BEGIN TRY 
	/*1.1 Creacion del Alumno */
	IF @alu_rut_old IS NULL
	BEGIN
		/* 1.1.1 Su rut no debe existir en la entidad ALUMNO */
		IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WHERE alu_rut = @alu_rut_new)
		BEGIN
			INSERT INTO UNIVERSIDAD.dbo.ALUMNO
			(alu_rut, alu_dv, alu_nombres, alu_apellido_paterno, alu_apellido_materno, alu_email, alu_celular, 
			anio_ingreso_universidad, periodo_ingreso_universidad, fecha_creacion, login_actualizacion)
			VALUES
			(@alu_rut_new, @alu_dv, @alu_nombres, @alu_apellido_paterno, @alu_apellido_materno, @alu_email, @alu_celular,
			@anio_ingreso_universidad, @periodo_ingreso_universidad, GETDATE(), @login_actualizacion)

			/*1.1.2 Si el alumno fue creado exitosamente se registra en la entidad de acceso de alumnos al sistema donde 
			se guarda su rut y una clave previamente encriptada (los ultimos 4 digitos de su rut antes del guion)*/
			INSERT INTO UNIVERSIDAD.dbo.ACCESO_ALUMNOS (alu_rut, usu_password) VALUES (@alu_rut_new, @password_encriptada)
		END
		ELSE
			INSERT INTO @respuesta VALUES ('Ya existe otro alumno con el rut ingresado', 'alu_rut_new', 400)
	END
	/* 1.2. Actualizacion del Alumno */
	ELSE
	BEGIN
		/* 	1.2.1 Su rut actual (alu_rut_old) debe existir en la entidad ALUMNO. */
		IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WHERE alu_rut = @alu_rut_old)
		BEGIN
			/* El nuevo rut (alu_rut_new) es distinto al original (alu_rut_old)  */  
			IF @alu_rut_new != @alu_rut_old
			BEGIN
				/* - Comprobar que el nuevo rut no exista para otro alumno en la entidad */
				/* - Si existe no se permite actualizar el alumno.   */
				IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WHERE alu_rut = @alu_rut_new) 
					INSERT INTO @respuesta VALUES ('Ya existe otro alumno con el rut ingresado', 'alu_rut_new', 400) 
				ELSE
				BEGIN
					/* Se permite actualizar el rut solo si el alumno no tiene una carrera inscrita */
					IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO_CARRERA WHERE alu_rut = @alu_rut_old)
						INSERT INTO @respuesta VALUES ('No se permite actualizar el rut del alumno porque ya está inscrito en una carrera', 'alu_rut_new', 400)  
				END
			END

			/* Aquí se cumplen las siguientes condiciones que dan paso a la actualización del alumno */  
			/* El nuevo rut (alu_rut_new) es igual al original (alu_rut_old) */  
			/* El nuevo rut (alu_rut_new) es distinto al original (alu_rut_old) pero el nuevo rut no existe para otro alumno en la entidad 
				ni tampoco este alumno tiene carreras inscritas
			*/  
			IF NOT EXISTS (SELECT 1 FROM @respuesta)  
			BEGIN
				/* En cualquier caso que sea posible actualizar el rut del alumno se debe actualizar en la entidad ACCESO_ALUMNOS y tambien su clave */
				UPDATE UNIVERSIDAD.dbo.ACCESO_ALUMNOS SET
				alu_rut = @alu_rut_new,
				usu_password = @password_encriptada
				WHERE
				alu_rut = @alu_rut_old

				UPDATE UNIVERSIDAD.dbo.ALUMNO SET 
				alu_rut = @alu_rut_new,
				alu_dv = @alu_dv,
				alu_nombres = @alu_nombres,
				alu_apellido_paterno = @alu_apellido_paterno,
				alu_apellido_materno = @alu_apellido_materno,
				alu_email = @alu_email,
				alu_celular = @alu_celular,
				anio_ingreso_universidad = @anio_ingreso_universidad,
				periodo_ingreso_universidad = @periodo_ingreso_universidad, 
				fecha_modificacion = GETDATE(),
				login_actualizacion = @login_actualizacion
				WHERE
				alu_rut = @alu_rut_old
			END
		END
		/*
		- Actualización de una Alumno:  
		- El rut a actualizar (crr_codigo_old) no existe porque pudo ser eliminada desde otra instancia del cliente  
		- El cliente tiene un error y esta mandando un crr_codigo_old que no se corresponde (puede ser el de un alumno que ya no existe)  
		*/  
		ELSE INSERT @respuesta (status_code) VALUES(500)  
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

/* Guardar el codigo estado de la transaccion, si todo salio bien la respuesta debe estar vacía en este punto */  
IF NOT EXISTS (SELECT 1 FROM @respuesta)  
 INSERT INTO @respuesta (status_code) VALUES (200) 

SELECT * FROM @respuesta  
GO
/* << SP GUARDAR / ACTUALIZAR ALUMNO */