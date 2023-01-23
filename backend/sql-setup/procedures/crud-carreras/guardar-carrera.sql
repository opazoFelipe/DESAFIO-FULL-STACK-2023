/* >> SP GUARDAR CARRERA */  
/*  
 fecha_creacion: 17-01-2023  
 autor: Felipe Opazo Rivas  
 Servicios: [{ url: /api/carreras, método: post }]  
  
 1. Definición: Guarda o actualiza una carrera  
  
 2. Consideraciones:   
 2.1 Se utiliza el parámetro crr_codigo_old para distinguir si se trata de una actualización o la creación limpia de una carrera  
 2.1.2 Si crr_codigo_old es null entonces se crea una nueva carrera (3.1.1)  
 2.1.3 Si crr_codigo_old es un número entonces se está actualizando una carrera existente (3.1.2, 3.2.1)  
  
 3. Reglas:  
 3.1 Contexto: La carrera está en una primera fase de registro donde no existen otras operaciones asociadas a ella   
 (por ejemplo no existe ningún alumno inscrito en la carrera).  
   
 3.1.1 Creación de una Carrera.  
 - El código de la carrera no debe existir previamente en la entidad.  
  
 3.1.2 Actualización de una Carrera.  
 - La carrera a actualizar debe existir en la entidad (crr_codigo_old)  
  
 - El nuevo codigo (crr_codigo_new) es igual al original (crr_codigo_old)  
   - Se permite la actualización de todos los campos de la carrera  
  
 - El nuevo codigo (crr_codigo_new) es distinto al original (crr_codigo_old)   
   - Comprobar que el nuevo codigo no exista para otra carrera en la entidad  
   - Si no existe se permite la actualización de código para la carrera y el resto de campos.  
   - Si existe no se permite actualizar la carrera.  
  
 3.2 Contexto: La carrera ya se ha involucrado en otras operaciones (por ejemplo se han inscrito alumnos en ella, ...)  
 3.2.1 Actualización de una Carrera.  
 - La carrera a actualizar debe existir en la entidad (crr_codigo_old)  
  
 - El nuevo codigo (crr_codigo_new) es igual al original (crr_codigo_old)  
  - Se permite la actualización de todos los campos de la carrera  
  
 - El nuevo codigo (crr_codigo_new) es distinto al original (crr_codigo_old)   
  - Se permite actualizar el codigo solo si la carrera no tiene alumnos inscritos
*/  
CREATE PROCEDURE dbo.GUARDAR_CARRERA  
(  
    @crr_codigo_new INT,  
    @escc_codigo INT,  
    @tprc_codigo INT,  
    @crr_nombre VARCHAR(255),  
    @rut_actualizacion NUMERIC(10, 0),  
 @crr_codigo_old INT = NULL  
)  
  
AS  
  
/* Status como http:   
200 -> La carrera fue guardarda / actualizada correctamente  
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
  
 /* Comprobar que las caves foraneas existan*/  
 IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ESCUELA_CARRERA WHERE escc_codigo = @escc_codigo)  
  INSERT INTO @respuesta VALUES ('La escuela seleccionada no existe', 'escc_codigo', 400)  
 IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA WHERE tprc_codigo = @tprc_codigo)  
  INSERT INTO @respuesta VALUES ('El tipo de programa seleccionado no existe', 'tprc_codigo', 400)  
  
 IF NOT EXISTS (SELECT 1 FROM @respuesta)  
 BEGIN  
  /*  
  2.1 Se utiliza el parámetro crr_codigo_old para distinguir si se trata de una actualización o la creación limpia de una carrera  
  2.1.2 Si crr_codigo_old es null entonces se crea una nueva carrera (3.1.1)   
  3.1.1 Creación de una Carrera.  
  */  
  IF @crr_codigo_old IS NULL  
  BEGIN  
   /* El código de la carrera no debe existir previamente en la entidad. */  
   IF NOT EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.CARRERA WHERE crr_codigo = @crr_codigo_new)  
    /* Ok para guardar la carrera */  
    INSERT INTO UNIVERSIDAD.dbo.CARRERA   
    (crr_codigo, tprc_codigo, escc_codigo, crr_nombre, fecha_creacion, fecha_modificacion, login_actualizacion)   
    VALUES   
    (@crr_codigo_new, @tprc_codigo, @escc_codigo, @crr_nombre, GETDATE(), NULL, @rut_actualizacion)  
     
   ELSE INSERT INTO @respuesta VALUES ('El código de la carrera ya existe', 'crr_codigo_new', 400)  
  END  
  /* 2.1.3 Si crr_codigo_old es un número entonces se está actualizando una carrera existente (3.1.2, 3.2.1) */  
  ELSE   
  /* 3.1.2 Actualización de una Carrera. */  
  BEGIN  
   /* La carrera a actualizar debe existir en la entidad (crr_codigo_old).*/  
   IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.CARRERA WHERE crr_codigo = @crr_codigo_old)  
   BEGIN  
    /* El nuevo codigo (crr_codigo_new) es distinto al original (crr_codigo_old)  */  
    IF (@crr_codigo_new != @crr_codigo_old)   
    BEGIN  
     /* Comprobar que el nuevo codigo no exista para otra carrera en la entidad */  
     /* Si existe no se permite actualizar la carrera.*/  
     IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.CARRERA WHERE crr_codigo = @crr_codigo_new)  
		  INSERT INTO @respuesta VALUES ('El código de la carrera ya existe', 'crr_codigo_new', 400)  
	ELSE
		BEGIN
		 /* Se permite actualizar el codigo solo si la carrera no tiene alumnos inscritos */
		 IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO_CARRERA WHERE crr_codigo = @crr_codigo_old)  
			INSERT INTO @respuesta VALUES ('No se permite actualizar el código de la carrera porque ya existen alumnos inscritos', 'crr_codigo_new', 400)  
		END
    END  

    /* Aquí se cumplen las siguientes condiciones que dan paso a la actualización de la carrera */  
    /* El nuevo codigo (crr_codigo_new) es igual al original (crr_codigo_old) */  
    /* El nuevo codigo (crr_codigo_new) es distinto al original (crr_codigo_old) pero el nuevo código no existe para otra carrera en la entidad 
	  ni tampoco existen alumnos inscritos
	*/  
    IF NOT EXISTS (SELECT 1 FROM @respuesta)  
    BEGIN  
     UPDATE UNIVERSIDAD.dbo.CARRERA SET  
     crr_codigo = @crr_codigo_new,   
     tprc_codigo = @tprc_codigo,  
     escc_codigo = @escc_codigo,  
     crr_nombre = @crr_nombre,  
     fecha_modificacion = GETDATE(),  
     login_actualizacion = @rut_actualizacion  
     WHERE  
     crr_codigo = @crr_codigo_old  
    END  
   END  
   /*  
   - Actualización de una Carrera:  
    - La carrera a actualizar (crr_codigo_old) no existe porque pudo ser eliminada desde otra instancia del cliente  
    - El cliente tiene un error y esta mandando un crr_codigo_old que no se corresponde (puede ser el de una carrera que ya no existe)  
   */  
   ELSE INSERT @respuesta (status_code) VALUES(500)  
  END  
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