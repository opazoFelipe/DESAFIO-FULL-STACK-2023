# Backend Mantenedor

1. Para correr este programa debemos situarnos en la raiz y ejecutar el comando:

```bash
npm install
```

2. Copiar el archivo .env.template en la misma raíz, renombrar a .env y llenar los campos requeridos

Los campos obligatorios son:


2.1 Entorno de ejecución, setear a development para local 

`NODE_ENV`=


2.2 Host clientes, Para desarrollo. 
Es básicamente la url del cliente React, se obtiene del despliegue automático cuando se ejecuta su comando `npm start`. Por ejemplo el formato sería como el siguiente: 

`CLIENT_HOST`=http://localhost:3000 


2.3 KEY para el jwt de autenticación (en local cualquier string)

`JWT_SECRET`=


2.4 Base de datos (SQL Server 2022)

`DB_HOST`=

`DB_PORT`=

`DB_NAME`=

`DB_USER`=

`DB_PASSWORD`=


### Para que las operaciones CRUD se puedan llevar a cabo se requiere, en una base de datos SQL Server, la más reciente, copiar, pegar y ejecutar todos los archivos sql que se encuentran en el directorio sql-setup partiendo por el archivo setup.sql

### El primer usuario, de perfil administrador, va insertado en dichos archivos con la clave encriptada, el rut es: 18.686.716-5 y la contraseña es 123456

3. Luego el comando:
```bash
npm start
```

## Pruebas con Postman

1. En postman, apartado "Collections", click en botón "import" y dejar caer el archivo "universidad.postman_collection.json" que se encuentra en el directorio /docs

2. En postman, apartado Environments, crear un nuevo environment con un nombre cualquiera y dentro crear una variable llamada "host", con el valor igual al host y puerto donde está corriendo este backend, ejemplo: `http://localhost:4000`

3. Luego volver al apartado collections y en la esquina superior derecha donde se encuentran el drop de environments seleccionar el environment creado.

4. Para comenzar a realizar llamadas al backend primero se debe hacer la request llamada "auth/login" y luego se pueden hacer el resto de request. Modificar el body raw del request y agregar las credenciales: { `"rut": 18686716`, `"password": 123456` }

Por defecto el setup de la base de datos tiene creado el perfil administrador para dicho rut.

Notas:
Para el resto de rutas, la variable alu_rut siempre debe ser la parte númerica del rut real.



