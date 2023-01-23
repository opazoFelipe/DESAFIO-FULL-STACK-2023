# Cliente Mantenedor

1. Para correr este programa debemos situarnos en la raiz y ejecutar el comando:

```bash
npm install
```
2. Copiar el archivo .env.template en la misma raíz, renombrar a .env y llenar los campos requeridos

Los campos obligatorios son:

# Entorno de ejecución, setear a development para local 
NODE_ENV=

# Host clientes
# Para desarrollo
# Es básicamente la url del cliente en react en este formato (por ejemplo)
CLIENT_HOST=http://localhost:3000 

# KEY para el jwt de autenticación (en local cualquier string)
JWT_SECRET=

# Base de datos (SQL Server 2022)
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Secret JWT, al menos de unos 32 caracteres variados
JWT_SECRET=

# Para que las operaciones CRUD se puedan llevar a cabo se requiere
# En una base de datos SQL Server, la más reciente, copiar, pegar y ejecutar todos los archivos sql
# que se encuentran en sql-setup partiendo por el archivo setup.sql

3. Luego el comando:
```bash
npm start
```