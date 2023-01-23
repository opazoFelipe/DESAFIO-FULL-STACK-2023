/* >> SP RECUPERA_PASSWORD_USUARIO */
CREATE PROCEDURE dbo.RECUPERA_PASSWORD_USUARIO    
(    
    @usu_rut NUMERIC(10, 0)    
)    
    
AS    
    
DECLARE @usu_password VARCHAR(255) = ''    
    
SELECT @usu_password = usu_password FROM UNIVERSIDAD.dbo.ACCESO_FUNCIONARIOS WITH(NOLOCK) WHERE fun_rut = @usu_rut    
    
IF LEN(@usu_password) > 0   
BEGIN
    SELECT @usu_password as usu_password    
	RETURN    
END
    
SELECT usu_password FROM UNIVERSIDAD.dbo.ACCESO_ALUMNOS WITH(NOLOCK) WHERE alu_rut = @usu_rut

GO
/* << SP RECUPERA_PASSWORD_USUARIO */


/* >> SP IDENTIFICA_ROL_USUARIO_CONSUMIDOR_SERVICIO_SISTEMA */
CREATE PROCEDURE dbo.IDENTIFICA_ROL_USUARIO_CONSUMIDOR_SERVICIO_SISTEMA
(
    @usu_rut NUMERIC(10, 0),
    @servicio_url VARCHAR(255),
    @http_method VARCHAR(10)
)

AS

DECLARE @ind_tiene_rol INT = 0
DECLARE @rol_alumno INT

/* Busca el rol alumno */
SELECT 
@rol_alumno = alumno
FROM UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA WITH(NOLOCK)

/* Define el id del servicio solicitado */
DECLARE @ser_id INT
SELECT TOP 1 @ser_id = ser_id FROM UNIVERSIDAD.dbo.SERVICIO_SISTEMA WITH(NOLOCK) WHERE ser_url = @servicio_url AND ser_metodo = @http_method

/* Si el servicio no esta registrado se impide el acceso */
IF @ser_id IS NULL
BEGIN
	SELECT @ind_tiene_rol as ind_tiene_rol
	RETURN
END

/* Definir los roles que pueden consumir el servicio solicitado */
DECLARE @roles TABLE (
    rol_id INT
)
INSERT INTO @roles (rol_id) SELECT rol_id FROM UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA WITH(NOLOCK) WHERE ser_id = @ser_id

/* Busca el rol del usuario segun si es un funcionario o un alumno */
IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.USUARIO_SISTEMA_FUNCIONARIO WITH(NOLOCK) 
WHERE usu_rut = @usu_rut AND usu_rol IN (SELECT rol_id FROM @roles))
    SET @ind_tiene_rol = 1

/* Busca si el servicio permite el acceso a alumnos solo si el usuario no es un funcionario */
IF @ind_tiene_rol != 1 AND EXISTS (SELECT 1 FROM @roles WHERE rol_id = @rol_alumno)
    IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WITH(NOLOCK) WHERE alu_rut = @usu_rut)
        SET @ind_tiene_rol = 1

SELECT @ind_tiene_rol as ind_tiene_rol

GO
/* << SP IDENTIFICA_ROL_USUARIO_CONSUMIDOR_SERVICIO_SISTEMA */

/* << SP RECUPERA LOS SERVICIOS QUE PUEDE CONSUMIR EL USUARIO */
/* 
	Recupera los servicios a los que tiene acceso el usuario según su rol, 
	estos servicios están mapeados en el cliente, los nombres deben coincidir 
*/
CREATE PROCEDURE dbo.RECUPERA_SERVICIOS_SEGUN_ROL (
    @usu_rut NUMERIC(10, 0)
)

AS

DECLARE @rol_alumno INT
/* Busca el rol alumno */
SELECT 
@rol_alumno = alumno
FROM UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA WITH(NOLOCK)

DECLARE @roles_usuario TABLE (
	rol_id INT
)

/* Busca el rol del usuario*/
/* Primero comprueba si es un funcionario y tiene acceso al sistema */
INSERT INTO @roles_usuario SELECT usu_rol FROM UNIVERSIDAD.dbo.USUARIO_SISTEMA_FUNCIONARIO WITH(NOLOCK)
WHERE usu_rut = @usu_rut

/* Segundo comprueba si es alumno */
IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WITH(NOLOCK) WHERE alu_rut = @usu_rut)
	INSERT INTO @roles_usuario VALUES(@rol_alumno)

SELECT DISTINCT
ser_url,
ser_metodo
FROM
UNIVERSIDAD.dbo.SERVICIO_SISTEMA ser WITH(NOLOCK)
INNER JOIN
UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA acss WITH(NOLOCK) ON
ser.ser_id = acss.ser_id
WHERE 
acss.rol_id IN (SELECT rol_id FROM @roles_usuario);

GO
/* << SP RECUPERA LOS SERVICIOS QUE PUEDE CONSUMIR EL USUARIO */


/* >> SP IDENTIFICA_ROL_USUARIO */
CREATE PROCEDURE [dbo].[IDENTIFICA_ROL_USUARIO]
(
    @usu_rut NUMERIC(10, 0)
)

AS

DECLARE 
@rol_admin INT,
@rol_alumno INT

DECLARE 
@ind_is_admin INT = 0,
@ind_is_alumno INT = 0

DECLARE @localRoles TABLE(
	ind_is_admin INT,
	ind_is_alumno INT
)

SELECT
@rol_admin = administrador
FROM UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA WITH(NOLOCK)

IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.USUARIO_SISTEMA_FUNCIONARIO WHERE usu_rut = @usu_rut AND usu_rol = @rol_admin)
    SET @ind_is_admin = 1

IF EXISTS (SELECT 1 FROM UNIVERSIDAD.dbo.ALUMNO WITH(NOLOCK) WHERE alu_rut = @usu_rut)
    SET @ind_is_alumno = 1

SELECT 
@ind_is_admin AS ind_is_admin,
@ind_is_alumno AS ind_is_alumno

GO
/* << SP IDENTIFICA_ROL_USUARIO */




