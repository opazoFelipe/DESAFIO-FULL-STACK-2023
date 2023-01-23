export enum NODE_ENV {
    development = 'development',
    test = 'test',
    production = 'production'
}

export const environment = {
    //  Entorno: development | test | production 
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    // Host del cliente
    CLIENT_HOST: process.env.NODE_ENV === NODE_ENV.production ? process.env.CLIENT_HOST_PRODUCTION : process.env.CLIENT_HOST,

    // Cors
    CORS_ORIGIN: process.env.NODE_ENV === NODE_ENV.production ? process.env.CLIENT_HOST_PRODUCTION : process.env.CLIENT_HOST,

    //  Base de datos
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,

    //  JWT
    JWT_SECRET: process.env.JWT_SECRET,

    //  Cookies
    COOKIE_SIGNED: process.env.NODE_ENV === NODE_ENV.production,
    COOKIE_SECRET_1: process.env.COOKIE_SECRET_1,
    COOKIE_SECRET_2: process.env.COOKIE_SECRET_2,
    COOKIE_SEGURE: process.env.NODE_ENV === NODE_ENV.production,
    COOKIE_HTTP_ONLY: process.env.NODE_ENV === NODE_ENV.production,

    // Morgan
    MORGAN: process.env.NODE_ENV === NODE_ENV.production ? 'combined' : 'dev',

    // Swagger
    SHOW_SWAGGER: process.env.NODE_ENV !== NODE_ENV.production,
    DEVELOPMENT_HOST: process.env.DEVELOPMENT_HOST,
}


