/* >> SP ELIMINAR_CARRERA */
/*
	fecha_creacion: 17-01-2023
	autor: Felipe Opazo Rivas
	Servicios: [{ url: /api/carreras/:crr_codigo, método: delete }]

    Consideraciones:
    - En este caso si el crr_codigo enviado no existe en la entidad CARRERA es debido a:
        - Que la carrera ya no exista, fue eliminada desde otra instancia del cliente de la app.
        - En ese caso se retorna un status 200 indicando que la carrera fue eliminada correctamente. 
        (No afecta a la integridad de la base de datos, ya que no se elimina nada, solo se retorna un status 200)
*/
CREATE PROCEDURE dbo.ELIMINAR_CARRERA
(
	@crr_codigo INT
)

AS 
/* Status como http: 
200 -> La carrera fue eliminada correctamente, 
403 -> La carrera no puede ser eliminada porque esta asociada a uno o mas alumnos
500 -> La transaccion fallo por un error inesperado
*/
DECLARE @respuesta TABLE(
	msg_error VARCHAR(100) NULL,
	status_code INT
);

BEGIN TRANSACTION;  
  
BEGIN TRY 

	/* Comprobar si la carrera no esta asociada a alumnos */
	IF EXISTS (SELECT 1 FROM ALUMNO_CARRERA WHERE crr_codigo = @crr_codigo)
		INSERT INTO @respuesta VALUES ('La carrera no puede ser eliminada porque existen alumnos inscritos', 403)
	/* Ok para eliminar*/
	ELSE	
		DELETE FROM UNIVERSIDAD.dbo.CARRERA WHERE crr_codigo = @crr_codigo
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
/* << SP ELIMINAR_CARRERA */