/* >> SP RECUPERA_CARRERAS */
/*  
 fecha_creacion: 17-01-2023  
 autor: Felipe Opazo Rivas  
 Servicios: [{ url: /api/carreras, método: get }]  
 
 Consideraciones:  
 - El ind_paginado va de la mano que el parametro nro_pagina, si ind_paginado = 1, entonces nro_pagina debe ser mayor a 0, se setea a 1 por defecto para evitar errores.  
 */
CREATE PROCEDURE dbo.RECUPERA_CARRERAS (
    @crr_codigo INT = NULL,
    @crr_nombre VARCHAR(255) = NULL,
    @escc_codigo INT = NULL,
    @tprc_codigo INT = NULL,
    @nro_pagina INT = NULL,
    @registros_por_pagina INT = 20
) AS 

DECLARE 
@_nro_pagina INT,
@_registros_por_pagina INT 

DECLARE @localCarreras TABLE (
    crr_codigo INT,
    crr_nombre VARCHAR(255),
    escc_codigo INT,
    escc_nombre VARCHAR(255),
    tprc_codigo INT,
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

INSERT INTO @localCarreras
SELECT
    c.crr_codigo,
    c.crr_nombre,
    escc.escc_codigo,
    escc.escc_nombre,
    tprc.tprc_codigo,
    tprc.tprc_nombre
FROM
    UNIVERSIDAD.dbo.CARRERA c WITH(NOLOCK)
    INNER JOIN UNIVERSIDAD.dbo.ESCUELA_CARRERA escc WITH(NOLOCK) ON c.escc_codigo = escc.escc_codigo
    INNER JOIN UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA tprc WITH(NOLOCK) ON c.tprc_codigo = tprc.tprc_codigo
WHERE
    (
        c.crr_codigo = @crr_codigo
        OR @crr_codigo IS NULL
    )
    AND (
        c.crr_nombre LIKE '%' + @crr_nombre + '%'
        OR @crr_nombre IS NULL
    )
    AND (
        c.escc_codigo = @escc_codigo
        OR @escc_codigo IS NULL
    )
    AND (
        c.tprc_codigo = @tprc_codigo
        OR @tprc_codigo IS NULL
    )
ORDER BY
    c.crr_nombre

DECLARE 
@total_registros INT

SET @total_registros = (SELECT COUNT(1) AS total_registros FROM @localCarreras)

SELECT 
@total_registros as total_registros,
* 
FROM @localCarreras
ORDER BY
crr_nombre
OFFSET (@_nro_pagina - 1) * @_registros_por_pagina ROWS FETCH NEXT @_registros_por_pagina ROWS ONLY