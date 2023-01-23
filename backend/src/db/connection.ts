import sql from 'mssql';

import { environment } from '../environment';

const sqlConfig = {
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
    server: environment.DB_HOST,
    port: parseInt(environment.DB_PORT),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

export async function getConnection() {
    try {
        const pool = await sql.connect(sqlConfig);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

