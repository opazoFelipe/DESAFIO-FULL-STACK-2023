import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { environment } from './environment';
import { errorHandler, NotFoundError, currentUser, requireAuth } from './common';

import { mantenedorAlumnosRouter } from './routes/alumnos';
import { authRouter } from './routes/auth';
import { mantenedorCarreraAlumnoRouter, mantenedorCarrerasRouter } from './routes/carreras';
import { usuarioRouter } from './routes/usuario';

const app = express();

app.use(cors({
    origin: environment.CORS_ORIGIN, // El cliente puede hacer peticiones a la API
    credentials: true, // Para que funcione el cookie session
}));

app.use(cookieSession({
    signed: true,
    keys: [environment.COOKIE_SECRET_1!, environment.COOKIE_SECRET_2!],
    httpOnly: false,

    secure: false // este es el que dice especificamente si se manda a la cookie al cliente en modo dev (para dev = false)

    // signed: environment.COOKIE_SIGNED, // La cookie se firma para que no se pueda modificar
    // keys: [environment.COOKIE_SECRET_1!, environment.COOKIE_SECRET_2!], // Las claves para firmar la cookie
    // secure: environment.COOKIE_SEGURE, // La cookie no se envia por http, solo por https
    // httpOnly: environment.COOKIE_HTTP_ONLY, // La cookie no se puede acceder por javascript (true solo en produccion)
}))

app.use(morgan(environment.MORGAN));
app.use(json());

// Identifica al usuario que esta haciendo la peticion
app.use(currentUser);

// Implementa ruta para login
app.use(authRouter);

// Identifica si el usuario esta logueado (Todas las rutas que siguen hacia abajo requieren login)
app.use(requireAuth)

// Implementa las rutas de la API
app.use(mantenedorAlumnosRouter);
app.use(mantenedorCarrerasRouter);
app.use(mantenedorCarreraAlumnoRouter);
app.use(usuarioRouter);

// Manejador para cualquier ruta solicitada que no exista
app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
