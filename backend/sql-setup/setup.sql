USE master;
GO

-- Crea la nueva base de datos
CREATE DATABASE admin_carreras;
GO

-- Crea un usuario llamado "admin_carreras"
CREATE LOGIN admin_carreras WITH PASSWORD='Ac12345678';
GO

-- Asigna permisos al usuario "admin_carreras" en la base de datos "admin_carreras"
USE admin_carreras;
GO
CREATE USER admin_carreras FOR LOGIN admin_carreras;
GO

GRANT SELECT,INSERT,UPDATE,DELETE ON admin_carreras TO admin_carreras
GO

CREATE TABLE UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA (
    [administrador][int] NOT NULL
);

CREATE TABLE dbo.ROL (
    [rol_id] [int] PRIMARY KEY NOT NULL,
    [rol_nombre] [varchar](255) NOT NULL,
);

CREATE TABLE dbo.ESCUELA_CARRERA (
    [escc_codigo] [int] PRIMARY KEY NOT NULL,
	[escc_nombre] [varchar](255) NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL
);

CREATE TABLE dbo.TIPO_PROGRAMA_CARRERA (
    [tprc_codigo] [int] PRIMARY KEY NOT NULL,
	[tprc_nombre] [varchar](255) NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL
);

CREATE TABLE dbo.CARRERA (
    [crr_codigo] [int] PRIMARY KEY NOT NULL,
    [tprc_codigo] [int] NOT NULL,
    [escc_codigo] [int] NOT NULL,
	[crr_nombre] [varchar](255) NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL,
    FOREIGN KEY (tprc_codigo) REFERENCES dbo.TIPO_PROGRAMA_CARRERA(tprc_codigo),
    FOREIGN KEY (escc_codigo) REFERENCES dbo.ESCUELA_CARRERA(escc_codigo)
);

CREATE TABLE dbo.FUNCIONARIO (
    [fun_rut] [numeric](10, 0) PRIMARY KEY NOT NULL,
    [fun_dv] [char](1) NOT NULL,
    [fun_nombres] [varchar](50) NOT NULL,
    [fun_apellido_paterno] [varchar](50) NULL,
	[fun_apellido_materno] [varchar](50) NULL,
    [fun_email] [varchar](50) NOT NULL,
    [fun_celular] [numeric](10, 0) NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL
);

CREATE TABLE [dbo].[USUARIO_SISTEMA_FUNCIONARIO](
	[usu_rut] [numeric](10, 0) NOT NULL,
    [usu_rol] [int] NOT NULL,
    [usu_fecha_inicio] [datetime] NOT NULL,
    [usu_fecha_termino] [datetime] NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL,
    PRIMARY KEY (usu_rut, usu_rol),
    FOREIGN KEY (usu_rut) REFERENCES dbo.FUNCIONARIO(fun_rut),
    FOREIGN KEY (usu_rol) REFERENCES dbo.ROL(rol_id),
);

CREATE TABLE [dbo].[ALUMNO](
    [alu_rut] [numeric](10, 0) PRIMARY KEY NOT NULL,
    [alu_dv] [char](1) NULL,
	[alu_nombres] [varchar](100) NULL,
	[alu_apellido_paterno] [varchar](50) NULL,
	[alu_apellido_materno] [varchar](50) NULL,
    [alu_email] [varchar](100) NULL,
    [alu_celular] [numeric](10, 0) NULL,
    [anio_ingreso_universidad] [int] NULL,
    [periodo_ingreso_universidad] [int] NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL
)

CREATE TABLE [dbo].[ALUMNO_CARRERA](
    [alu_rut] [numeric](10, 0) NOT NULL,
	[crr_codigo] [int] NOT NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
	[login_actualizacion] [nvarchar](255) NOT NULL,
    PRIMARY KEY (alu_rut, crr_codigo),
    FOREIGN KEY (alu_rut) REFERENCES dbo.ALUMNO(alu_rut),
    FOREIGN KEY (crr_codigo) REFERENCES dbo.CARRERA(crr_codigo),
);

CREATE TABLE [dbo].[ACCESO_FUNCIONARIOS] (
    [fun_rut] [numeric](10, 0) PRIMARY KEY NOT NULL,
    [usu_password] [varchar](255) NOT NULL
);

CREATE TABLE [dbo].[ACCESO_ALUMNOS](
    [alu_rut] [numeric](10, 0) PRIMARY KEY NOT NULL,
    [usu_password] [varchar](255) NOT NULL
);

CREATE TABLE [dbo].[SERVICIO_SISTEMA](
    [ser_id] [int] PRIMARY KEY NOT NULL,
    [ser_url] [varchar](255) NOT NULL,
	[ser_metodo] [varchar](10) NOT NULL,
);

CREATE TABLE [dbo].[MODULO_USUARIO](
    [mod_id] [int] PRIMARY KEY NOT NULL,
    [mod_nombre] [varchar](255) NOT NULL,
    [mod_descripcion] [varchar](255) NOT NULL,
    [mod_url] [varchar](255) NOT NULL,
    [mod_componente] [varchar](255) NOT NULL,
    [mod_icono] [varchar](50) NULL,
    [fecha_creacion] [datetime] NOT NULL,
    [fecha_modificacion] [datetime] NULL,
    [login_actualizacion] [nvarchar](255) NOT NULL
);

CREATE TABLE [dbo].[ACCESO_SERVICIO_SISTEMA](
    [ser_id] [int] NOT NULL,
    [rol_id] [int] NOT NULL,
    PRIMARY KEY (ser_id, rol_id),
    FOREIGN KEY (ser_id) REFERENCES dbo.SERVICIO_SISTEMA(ser_id),
    FOREIGN KEY (rol_id) REFERENCES dbo.ROL(rol_id)
);

/* >> CREAR PARAMETROS GENERICOS */
INSERT INTO UNIVERSIDAD.dbo.ROL VALUES (1, 'administrador');
INSERT INTO UNIVERSIDAD.dbo.ROL VALUES (2, 'alumno');

INSERT INTO UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA VALUES (1);

ALTER TABLE UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA ADD alumno INT NULL;
UPDATE UNIVERSIDAD.dbo.PARAMETROS_ACCESO_SISTEMA SET alumno = 2;
/* << CREAR PARAMETROS GENERICOS */

/* >> CREAR ESCUELAS */
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (1, 'Escuela de Administración', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (2, 'Escuela de Procesos Industriales', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (3, 'Escuela de Tecnologías Aplicadas', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (4, 'Escuela de Desarrollo Social y Educación', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (5, 'Escuela de Administración', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (6, 'Escuela de Procesos Industriales', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.ESCUELA_CARRERA VALUES (7, 'Escuela de Tecnologías Aplicadas', GETDATE(), NULL, '18686716');
/* << CREAR ESCUELAS */

/* >> CREAR PROGRAMAS */
INSERT INTO UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA VALUES (1, 'Carrera Técnica', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA VALUES (2, 'Carrera Profesional', GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA VALUES (3, 'Diplomado', GETDATE(), NULL, '18686716');
/* << CREAR PROGRAMAS */

/* >> CREAR EL ADMINISTRADOR DEL SISTEMA */
INSERT INTO UNIVERSIDAD.dbo.FUNCIONARIO VALUES
(18686716, '5', 'FELIPE ANTONIO', 'OPAZO', 'RIVAS', 'felipe.orivas@gmail.com', 978700172, GETDATE(), NULL, '18686716');

INSERT INTO UNIVERSIDAD.dbo.USUARIO_SISTEMA_FUNCIONARIO VALUES
(18686716, 1, GETDATE(), NULL, GETDATE(), NULL, '18686716');

/* password 123456 */
INSERT INTO ACCESO_FUNCIONARIOS VALUES (18686716, '$2a$10$2c5BZGKa/oNl4qR//8rhB.DVgOTQILM19IOTG0W646IdK0V8UjeWe')
/* << CREAR EL ADMINISTRADOR DEL SISTEMA */

/* >> CREAR LOS SERVICIOS DEL SISTEMA */
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (1, '/api/carreras', 'post');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (2, '/api/carreras', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (3, '/api/carreras/:crr_codigo', 'delete');

INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (4, '/api/alumnos', 'post');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (5, '/api/alumnos', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (6, '/api/alumnos/:alu_rut', 'delete');

INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (7, '/api/carreras/alumnos', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (8, '/api/carreras/alumnos/:crr_codigo', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (9, '/api/carreras/alumnos', 'post');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (10, '/api/carreras/alumnos/:crr_codigo/:alu_rut', 'delete');

INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (11, '/api/mantenedor-carreras', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (12, '/api/mantenedor-alumnos', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (13, '/api/mantenedor-carrera-alumno/:crr_codigo', 'get');
INSERT INTO UNIVERSIDAD.dbo.SERVICIO_SISTEMA VALUES (14, '/api/consulta-carrera-alumno', 'get');

/* << CREAR LOS SERVICIOS DEL SISTEMA */

/* >> DEFINIR LOS ROLES QUE ACCEDEN A CADA SERVICIO DEL SISTEMA */
/* Rol administrador = 1, alumno = 2 */

/* crud carreras*/
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (1, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (2, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (3, 1);

/* crud alumnos */
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (4, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (5, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (6, 1);

/* crud carrera alumno */
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (7, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (8, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (9, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (10, 1);

/* modulos mantenedores */
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (11, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (12, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (13, 1);
INSERT INTO UNIVERSIDAD.dbo.ACCESO_SERVICIO_SISTEMA VALUES (14, 1);
/* << DEFINIR LOS ROLES QUE ACCEDEN A CADA SERVICIO DEL SISTEMA */

/* >> CREAR LOS MODULOS DEL USUARIO */
INSERT INTO UNIVERSIDAD.dbo.MODULO_USUARIO VALUES (1, 'Carreras', 'CRUD de carreras', '/admin/carreras', 'MantenedorCarreras', NULL, GETDATE(), NULL, '18686716');
INSERT INTO UNIVERSIDAD.dbo.MODULO_USUARIO VALUES (2, 'Alumnos', 'CRUD de alumnos', '/admin/alumnos', 'MantenedorAlumnos', NULL, GETDATE(), NULL, '18686716');
/* << CREAR LOS MODULOS DEL USUARIO */
