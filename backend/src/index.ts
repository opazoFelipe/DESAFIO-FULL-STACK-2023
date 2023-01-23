import dotenv from 'dotenv';
dotenv.config();

import { NODE_ENV } from './environment';
import { getConnection } from './db/connection';
import { app } from './app';

const start = async () => {
    if (!process.env.NODE_ENV) {
        throw new Error('NODE_ENV must be defined');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined');
    }

    if (process.env.NODE_ENV === NODE_ENV.production) {
        if (!process.env.COOKIE_SECRET_1 || !process.env.COOKIE_SECRET_2) {
            throw new Error('COOKIE_SECRET_1 and COOKIE_SECRET_2 must be defined');
        }

        if (!process.env.CLIENT_HOST_PRODUCTION) {
            throw new Error('CLIENT_HOST_PRODUCTION must be defined');
        }
    } else {
        if (!process.env.CLIENT_HOST) {
            throw new Error('CLIENT_HOST_1 must be defined');
        }
    }

    getConnection()
        .then(() => {
            console.log('Base de datos conectada');
            const appPort = process.env.PORT || 3000;
            app.listen(appPort, () => {
                console.log(`Servidor corriendo en el puerto ${appPort}`);
            });
        })
        .catch(console.log);
}

start();


