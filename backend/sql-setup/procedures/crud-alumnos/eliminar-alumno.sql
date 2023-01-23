/* >> SP ELIMINAR ALUMNO */
/*
	Reglas:
	Contexto 1: El alumno fue o es creado en una primera fase de registro donde no existen otras operaciones
	que se hayan realizado con este alumno (por ejemplo asociarlo a una carrera, ..)

	1.1 Eliminacion del Alumno.
	1.1.1 El alumno puede ser eliminado.
	1.1.2 El alumno debe ser eliminado de la entidad que permite el acceso al sistema

	Contexto 2: El alumno ya fue creado y ya ha pasado por distintas operaciones (por ejemplo ya fue asociado a una carrera, ...)
	2.1 Eliminacion del Alumno.
    2.1.1 El alumno no puede ser eliminado, se deben eliminar primero las operaciones que se hayan realizado con el alumno.

    Consideraciones:
    - En este caso si el alu_rut enviado no existe en la entidad ALUMNO es debido a:
        - Que el alumno ya no exista, fue eliminado desde otra instancia del cliente de la app.
        - En ese caso se retorna un status 200 indicando que el alumno fue eliminado correctamente. 
        (No afecta a la integridad de la base de datos, ya que no se elimina nada, solo se retorna un status 200)
*/
CREATE PROCEDURE dbo.ELIMINAR_ALUMNO
(
    @alu_rut NUMERIC(10, 0)
)

AS
/* Status como http: 
500 -> La transaccion fallo por error inesperado, 
200 -> El alumno fue eliminado correctamente, 
403 -> El alumno no puede ser eliminado porque esta asociado a una o mas carreras
*/
DECLARE @respuesta TABLE(
	msg_error VARCHAR(100) NULL,
	status_code INT
);

BEGIN TRANSACTION;  
  
BEGIN TRY 


/*	1.1 Eliminacion del Alumno.
	1.1.1 El alumno puede ser eliminado. 
*/
IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO_CARRERA WHERE alu_rut = @alu_rut)
BEGIN
	DELETE FROM UNIVERSIDAD.dbo.ALUMNO WHERE alu_rut = @alu_rut

	/* 1.1.2 El alumno debe ser eliminado de la entidad que permite el acceso al sistema */
	DELETE FROM UNIVERSIDAD.dbo.ACCESO_ALUMNOS WHERE alu_rut = @alu_rut
END
ELSE
	INSERT INTO @respuesta VALUES ('El alumno no puede ser eliminado porque está inscrito en una o más carreras', 403)
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
/* << SP ELIMINAR ALUMNO */