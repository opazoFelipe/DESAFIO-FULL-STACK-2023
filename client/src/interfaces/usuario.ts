export interface ILogin {
    rut: string;
    password: string;
}

export interface IBackButtonLastData {
    simpleFiltros?: {
        [key: string]: string;
    },
    complexData?: {
        [key: string]: any;
    }
    // Implementar hacia abajo todas las propiedades que se necesiten
}
